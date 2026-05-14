import gsap from "gsap";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const executeTransition = (href: string, router: AppRouterInstance, scrollHash?: string) => {
  const wipe = document.getElementById("wipe-block");
  
  if (!wipe) {
    // Store flags even without animation
    sessionStorage.setItem("wipe-navigating", "1");
    if (scrollHash) sessionStorage.setItem("scroll-to-hash", scrollHash);
    router.push(href);
    return;
  }
  
  // Wipe Down (Top to Cover)
  gsap.fromTo(wipe, 
    { top: "-100vh" }, 
    { 
      top: "0vh", 
      duration: 0.48, 
      ease: "cubic-bezier(0.87, 0, 0.13, 1)", 
      onComplete: () => {
        // Set flag so destination page skips its preloader / reads the hash
        sessionStorage.setItem("wipe-navigating", "1");
        if (scrollHash) sessionStorage.setItem("scroll-to-hash", scrollHash);
        router.push(href.split('#')[0] || href);
      }
    }
  );
};
