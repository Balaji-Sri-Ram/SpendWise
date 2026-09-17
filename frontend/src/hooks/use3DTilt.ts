import { useEffect, useRef } from 'react';

export function use3DTilt<T extends HTMLElement>(enabled: boolean = true) {
  const ref = useRef<T>(null);
  const rafRef = useRef<number | null>(null);
  const isHovered = useRef<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const maxTilt = 3;
    const maxScale = 1.005;
    const liftPx = 2;

    const handleMouseEnter = () => {
      isHovered.current = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered.current) return;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        
        const rx = ((y - cy) / cy) * -maxTilt;
        const ry = ((x - cx) / cx) * maxTilt;
        
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${maxScale},${maxScale},${maxScale}) translateY(-${liftPx}px)`;
        el.style.transition = 'transform 0.10s ease-out';

      });
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1) translateY(0px)';
      el.style.transition = 'transform 0.50s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    };

    el.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      el.style.transform = '';
      el.style.transition = '';
    };
  }, [enabled]);

  return ref;
}
