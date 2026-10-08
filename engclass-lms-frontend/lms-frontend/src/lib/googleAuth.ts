// Wrapper tipis di atas Google Identity Services (GIS). Dimuat lewat <script> tag di
// index.html (bukan paket npm) — API-nya sudah stabil bertahun-tahun dan didokumentasikan
// resmi oleh Google, jadi risikonya jauh lebih rendah dibanding menambah dependency npm
// yang tidak bisa diverifikasi (lihat alasan di README soal particle library).
//
// Sebelum ini, tombol "Masuk/Daftar dengan Google" mengirim string placeholder hardcode
// ("mock-google-id-token") ke backend — itu sebabnya backend menolak dengan "Wrong number
// of segments in token". Modul ini menggantinya dengan token JWT asli dari Google.

export interface GooglePromptNotification {
  isDisplayed?: () => boolean;
  isNotDisplayed?: () => boolean;
  isSkippedMoment?: () => boolean;
  isDismissedMoment?: () => boolean;
  getNotDisplayedReason?: () => string;
  getSkippedReason?: () => string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (momentListener?: (notification: GooglePromptNotification) => void) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/** True kalau Client ID sudah diisi DAN script GIS sudah selesai dimuat di window. */
export function isGoogleReady(): boolean {
  return Boolean(CLIENT_ID) && typeof window !== "undefined" && Boolean(window.google?.accounts?.id);
}

/** True kalau .env sudah mengisi VITE_GOOGLE_CLIENT_ID (terlepas dari script sudah termuat atau belum). */
export function isGoogleConfigured(): boolean {
  return Boolean(CLIENT_ID);
}

function waitForGoogleIdentityServices(timeoutMs = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Google login hanya tersedia di browser."));
      return;
    }
    let script = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        window.clearInterval(timer);
        resolve();
      } else if (Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(timer);
        reject(new Error("Google Identity Services gagal dimuat. Periksa koneksi dan konfigurasi Client ID."));
      }
    }, 50);
  });
}

export async function renderGoogleButton(
  target: HTMLElement,
  onCredential: (credential: string) => void
): Promise<void> {
  if (!CLIENT_ID) throw new Error("VITE_GOOGLE_CLIENT_ID belum diisi di file .env");
  await waitForGoogleIdentityServices();
  window.google!.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: ({ credential }) => onCredential(credential),
  });
  window.google!.accounts.id.renderButton(target, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "rectangular",
    width: Math.max(240, Math.floor(target.getBoundingClientRect().width)),
    logo_alignment: "left",
  });
}

/**
 * Membuka jendela pilih-akun Google (One Tap) dan mengembalikan id_token (JWT) asli
 * begitu user memilih akun. Token inilah yang dikirim ke backend (§20 PRD: wajib
 * diverifikasi server-side lewat google-auth-library sebelum membuat sesi) — frontend
 * TIDAK pernah membaca isi token ini sendiri, cuma meneruskannya.
 */
export function signInWithGoogle(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID) {
      reject(new Error("VITE_GOOGLE_CLIENT_ID belum diisi di file .env"));
      return;
    }
    if (!window.google?.accounts?.id) {
      reject(new Error("Google Identity Services belum selesai dimuat — coba lagi sebentar"));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: (response) => {
        if (response?.credential) {
          resolve(response.credential);
        } else {
          reject(new Error("Tidak menerima credential dari Google"));
        }
      },
    });

    // Moment listener wajib ada — tanpa ini, kalau Google menekan (suppress) prompt-nya
    // sendiri (mis. user baru saja menutup One Tap berkali-kali), Promise di atas akan
    // menggantung selamanya tanpa resolve/reject sama sekali.
    window.google.accounts.id.prompt((notification) => {
      if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
        reject(
          new Error(
            "Jendela pilih akun Google tidak muncul. Coba lagi, atau pastikan pop-up tidak diblokir browser."
          )
        );
      }
      if (notification?.isDismissedMoment?.()) {
        reject(new Error("Login Google dibatalkan."));
      }
    });
  });
}

/**
 * Dipakai bareng oleh LoginPage & RegisterPage. Kalau Client ID sudah dikonfigurasi,
 * selalu minta token ASLI dari Google — termasuk saat VITE_USE_MOCK=true, karena
 * backend-nya sendiri (kalau sudah tersambung) tetap akan menolak token palsu.
 * Placeholder hanya dipakai sebagai jalan pintas eksplorasi UI, saat Client ID
 * benar-benar belum diisi DAN mode mock aktif.
 */
export async function resolveGoogleCredential(useMock: boolean): Promise<string> {
  if (useMock) return "mock-google-id-token";
  if (isGoogleConfigured()) {
    return signInWithGoogle();
  }
  throw new Error("Login Google belum dikonfigurasi (VITE_GOOGLE_CLIENT_ID kosong di .env).");
}
