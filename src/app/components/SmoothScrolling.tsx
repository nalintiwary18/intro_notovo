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

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so both use the same rAF loop
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Only freeze if the home preloader is going to run.
    // If we arrived via wipe transition OR we're on a non-home page, start immediately.
    const isWipeArrival = sessionStorage.getItem("wipe-navigating") === "1";
    const isHomePage = window.location.pathname === "/";
    const preloaderWillRun = isHomePage && !isWipeArrival;

    if (preloaderWillRun) {
      // Start frozen — preloader will unlock it
      lenis.stop();
      const onPreloaderDone = () => lenis.start();
      window.addEventListener("preloader:complete", onPreloaderDone);
      return () => {
        gsap.ticker.remove(tickerFn);
        window.removeEventListener("preloader:complete", onPreloaderDone);
        window.__lenis = undefined;
        lenis.destroy();
      };
    } else {
      // No preloader — start scrolling right away
      lenis.start();
    }

    return () => {
      gsap.ticker.remove(tickerFn);
      window.__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
