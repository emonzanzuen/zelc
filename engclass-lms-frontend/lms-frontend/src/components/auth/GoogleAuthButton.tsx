import { useEffect, useRef, useState } from "react";
import { renderGoogleButton } from "@/lib/googleAuth";
import { USE_MOCK } from "@/lib/api";

interface GoogleAuthButtonProps {
  label: string;
  onCredential: (credential: string) => Promise<void>;
  onError: (error: string) => void;
}

export function GoogleAuthButton({ label, onCredential, onError }: GoogleAuthButtonProps) {
  const target = useRef<HTMLDivElement>(null);
  const credentialHandler = useRef(onCredential);
  const errorHandler = useRef(onError);
  const [loading, setLoading] = useState(false);

  useEffect(() => { credentialHandler.current = onCredential; }, [onCredential]);
  useEffect(() => { errorHandler.current = onError; }, [onError]);

  useEffect(() => {
    if (USE_MOCK || !target.current) return;
    let active = true;
    renderGoogleButton(target.current, async (credential) => {
      setLoading(true);
      try {
        await credentialHandler.current(credential);
      } catch (error) {
        errorHandler.current(error instanceof Error ? error.message : "Gagal masuk dengan Google.");
      } finally {
        if (active) setLoading(false);
      }
    }).catch((error: unknown) => {
      if (active) errorHandler.current(error instanceof Error ? error.message : "Tombol Google gagal dimuat.");
    });
    return () => { active = false; };
  }, []);

  async function mockSignIn() {
    setLoading(true);
    try {
      await credentialHandler.current("mock-google-id-token");
    } catch (error) {
      errorHandler.current(error instanceof Error ? error.message : "Gagal masuk dengan Google.");
    } finally {
      setLoading(false);
    }
  }

  if (USE_MOCK) {
    return (
      <button
        type="button"
        onClick={mockSignIn}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5"
      >
        <GoogleIcon />{loading ? "Memproses..." : label}
      </button>
    );
  }

  return (
    <div className="relative min-h-10 w-full">
      <div ref={target} className="flex min-h-10 w-full justify-center" />
      {loading && <div className="absolute inset-0 flex items-center justify-center rounded bg-white/70 text-sm dark:bg-black/50">Memproses...</div>}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.85.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 009 18z" />
      <path fill="#FBBC05" d="M3.96 10.71a5.4 5.4 0 010-3.42V4.96H.96a9 9 0 000 8.08l3-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}
