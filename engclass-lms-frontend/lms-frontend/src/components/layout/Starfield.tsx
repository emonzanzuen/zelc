import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
}

// Starfield kustom berbasis Canvas (Zero Dependency) — tanpa pustaka pihak ketiga.
// Titik-titik bintang/partikel bergerak mengalir perlahan (gentle drift),
// opacity berosilasi lembut (twinkle), densitas otomatis menyesuaikan dimensi kontainer,
// sinkronisasi warna terhadap dark/light mode secara reaktif tanpa me-reset loop,
// dan mendukung prefers-reduced-motion (berhenti bergerak, tetap tampil statis).
export function Starfield({
  density = 0.00012,
  maxStars = 160,
  className = "",
}: {
  /** Jumlah bintang per piksel persegi area canvas. */
  density?: number;
  maxStars?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const drawFrameRef = useRef<() => void>(() => {});

  // Selalu perbarui ref saat tema berubah agar render loop membaca warna terbaru
  // tanpa perlu me-reset / merusak animation loop yang sedang berjalan.
  useEffect(() => {
    themeRef.current = theme;
    drawFrameRef.current();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDestroyed = false;
    let rafId = 0;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];

    // Deteksi prefers-reduced-motion native
    const mediaQuery =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    let isReducedMotion = mediaQuery ? mediaQuery.matches : false;

    function createStar(w: number, h: number): Star {
      const speed = Math.random() * 0.25 + 0.08;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 1.3 + 0.4,
        baseAlpha: Math.random() * 0.5 + 0.35,
        twinkleSpeed: Math.random() * 0.8 + 0.3,
        phase: Math.random() * Math.PI * 2,
      };
    }

    function resize() {
      if (isDestroyed) return;
      const rect = container!.getBoundingClientRect();
      const newWidth = Math.max(1, Math.floor(rect.width));
      const newHeight = Math.max(1, Math.floor(rect.height));

      // Jika kontainer belum memiliki dimensi render (misal saat pre-layout), tunda
      if (rect.width === 0 && rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = newWidth;
      height = newHeight;

      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = Math.min(
        maxStars,
        Math.max(16, Math.floor(width * height * density))
      );

      if (stars.length === 0) {
        stars = Array.from({ length: targetCount }, () => createStar(width, height));
      } else if (stars.length < targetCount) {
        const added = Array.from({ length: targetCount - stars.length }, () =>
          createStar(width, height)
        );
        stars = [...stars, ...added];
      } else if (stars.length > targetCount) {
        stars = stars.slice(0, targetCount);
      }

      // Pastikan posisi bintang yang ada tetap berada di dalam batas baru
      for (const s of stars) {
        if (s.x > width) s.x = Math.random() * width;
        if (s.y > height) s.y = Math.random() * height;
      }
    }

    function render(time: number) {
      if (isDestroyed) return;

      // Bersihkan canvas per frame
      ctx!.clearRect(0, 0, width, height);

      // Cek warna aktif (mendukung dark class di html atau tema context)
      const isDark =
        themeRef.current === "dark" ||
        (typeof document !== "undefined" &&
          document.documentElement.classList.contains("dark"));
      const dotColor = isDark ? "255, 255, 255" : "124, 58, 237";

      const t = time / 1000;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Mutasi posisi partikel jika reduced motion tidak aktif
        if (!isReducedMotion) {
          star.x += star.vx;
          star.y += star.vy;

          // Wrap-around mulus di batas canvas
          if (star.x < -star.radius) star.x = width + star.radius;
          else if (star.x > width + star.radius) star.x = -star.radius;

          if (star.y < -star.radius) star.y = height + star.radius;
          else if (star.y > height + star.radius) star.y = -star.radius;
        }

        // Hitung opacity berkilau (twinkle)
        const alpha = isReducedMotion
          ? star.baseAlpha
          : star.baseAlpha + Math.sin(t * star.twinkleSpeed + star.phase) * 0.3;
        const clampedAlpha = Math.max(0, Math.min(1, alpha));

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${dotColor}, ${clampedAlpha})`;
        ctx!.fill();
      }

      // Jadwalkan frame berikutnya jika reduced motion tidak aktif
      if (!isReducedMotion && !isDestroyed) {
        rafId = requestAnimationFrame(render);
      }
    }

    drawFrameRef.current = () => {
      render(performance.now());
    };

    // Inisialisasi awal
    resize();
    render(performance.now());

    // Gunakan ResizeObserver untuk menangani perubahan ukuran kontainer secara presisi
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        resize();
        if (isReducedMotion) render(performance.now());
      });
      resizeObserver.observe(container);
    }

    const onWindowResize = () => {
      resize();
      if (isReducedMotion) render(performance.now());
    };
    window.addEventListener("resize", onWindowResize);

    // Pantau perubahan preferensi motion pengguna secara dinamis
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        if (rafId) cancelAnimationFrame(rafId);
        render(performance.now());
      } else {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(render);
      }
    };
    mediaQuery?.addEventListener("change", handleMotionChange);

    // Cleanup saat unmount
    return () => {
      isDestroyed = true;
      drawFrameRef.current = () => {};
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", onWindowResize);
      mediaQuery?.removeEventListener("change", handleMotionChange);
    };
  }, [density, maxStars]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
