import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../lib/motion';

/** Revela o conteúdo com fade e deslocamento suave ao montar. Não anima se o usuário pede movimento reduzido. */
export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.from(el, { opacity: 0, y: 32, duration: 0.9, ease: 'power3.out', clearProps: 'all' });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
