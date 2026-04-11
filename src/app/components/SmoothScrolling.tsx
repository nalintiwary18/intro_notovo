"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Augment window type so NavMenu can access Lenis for smooth anchor scroll
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Expose for NavMenu smooth anchor scrolling
    window.__lenis = lenis;

    // Start frozen — preloader will unlock it
    lenis.stop();

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so both use the same rAF loop
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Unlock scroll once preloader fires its completion event
    const onPreloaderDone = () => lenis.start();
    window.addEventListener("preloader:complete", onPreloaderDone);

    return () => {
      gsap.ticker.remove(tickerFn);
      window.removeEventListener("preloader:complete", onPreloaderDone);
      window.__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
