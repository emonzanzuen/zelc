import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { prefersReducedMotion } from "@/hooks/useLenis";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
}

// Starfield kustom berbasis Canvas — lihat penjelasan di README soal kenapa ini TIDAK
// memakai library pihak ketiga (tsparticles dkk). Titik-titik kecil dengan opacity
// berosilasi lembut (efek "berkelip"), kepadatan menyesuaikan luas elemen, warna
// mengikuti dark/light mode, dan berhenti berkelip total kalau prefers-reduced-motion
// aktif (tetap tampil statis, tidak dihilangkan — demi konsistensi visual).
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let rafId = 0;
    let width = 0;
    let height = 0;

    function resize() {
      const rect = container!.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(maxStars, Math.max(16, Math.floor(width * height * density)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.4,
        baseAlpha: Math.random() * 0.5 + 0.35,
        twinkleSpeed: Math.random() * 0.8 + 0.3,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    const dotColor = theme === "dark" ? "255, 255, 255" : "124, 58, 237";

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);
      const t = time / 1000;
      for (const star of stars) {
        const alpha = reducedMotion
          ? star.baseAlpha
          : star.baseAlpha + Math.sin(t * star.twinkleSpeed + star.phase) * 0.3;
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${dotColor}, ${Math.max(0, Math.min(1, alpha))})`;
        ctx!.fill();
      }
      if (!reducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    }

    resize();
    draw(0);

    const onResize = () => {
      resize();
      if (reducedMotion) draw(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [theme, density, maxStars]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
