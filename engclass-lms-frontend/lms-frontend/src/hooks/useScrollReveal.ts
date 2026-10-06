import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./useLenis";

gsap.registerPlugin(ScrollTrigger);

// Stagger reveal untuk grid/list (course card, kategori, dsb) saat masuk viewport.
export function useScrollReveal<T extends HTMLElement>(deps: unknown[] = []) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) return;
    const items = containerRef.current.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
