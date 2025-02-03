import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
      infinite: false,
    });

    // Integrate with RAF (RequestAnimationFrame)
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Start the animation loop
    requestAnimationFrame(raf);

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Only handle internal anchor links
      if (!href?.startsWith('#')) return;
      
      const element = document.querySelector(href);
      if (!element) return;
      
      e.preventDefault();
      
      // Updated scroll behavior for anchor links
      lenis.scrollTo(element as HTMLElement, {
        offset: -50,
        duration: 1,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    };

    // Add event listener for anchor links
    document.addEventListener('click', handleAnchorClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return null;
} 