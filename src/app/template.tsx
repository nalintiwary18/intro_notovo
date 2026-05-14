"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const wipe = document.getElementById("wipe-block");
    
    // If the wipe block is currently covering the screen (from executeTransition)
    if (wipe && wipe.style.top === "0vh") {
      gsap.to(wipe, {
        top: "100vh",
        duration: 0.48,
        ease: "cubic-bezier(0.87, 0, 0.13, 1)",
        onComplete: () => {
          // Reset waiting for next transition
          gsap.set(wipe, { top: "-100vh" });
        }
      });
    }
  }, []);

  return <>{children}</>;
}
