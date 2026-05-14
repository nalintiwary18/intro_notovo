"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { executeTransition } from "@/utils/transition";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
];

const ArrowSVG = () => (
  <svg width="100%" viewBox="0 0 45 38" fill="none" aria-hidden="true">
    <path
      d="M24.4118 2L41.5 19.0882L24.4118 36.1765M0 19.0882L40.2794 19.0882"
      stroke="currentColor"
      strokeWidth="4.88235"
    />
  </svg>
);

const DotsSVG = () => (
  <svg width="100%" viewBox="0 0 14 7" fill="none" aria-hidden="true">
    <circle cx="11.45" cy="3.5" r="2.55" fill="currentColor" />
    <circle cx="2.55" cy="3.5" r="2.55" fill="currentColor" />
  </svg>
);

export default function NavMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const staggerTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearStaggerTimers = () => {
    staggerTimersRef.current.forEach(clearTimeout);
    staggerTimersRef.current = [];
  };

  const openMenu = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    clearStaggerTimers();
    setMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimated(true);
        NAV_LINKS.forEach((_, i) => {
          const t = setTimeout(() => {
            setVisibleItems((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }, i * 70);
          staggerTimersRef.current.push(t);
        });
      });
    });
  }, []);

  const closeMenu = useCallback(() => {
    clearStaggerTimers();
    setAnimated(false);
    setVisibleItems([]);
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
    }, 500);
  }, []);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) openMenu();
    else closeMenu();
  };

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    closeMenu();
    setOpen(false);

    const targetPath = href.split('#')[0] || '/';
    const targetHash = href.split('#')[1];

    if (pathname === targetPath) {
      if (targetHash) {
        const targetEl = document.getElementById(targetHash);
        if (targetEl) {
          setTimeout(() => {
            const lenis = (window as any).__lenis;
            if (lenis) {
              lenis.scrollTo(targetEl, { duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
              targetEl.scrollIntoView({ behavior: "smooth" });
            }
          }, 120);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Delay slightly to allow menu closing animation to start, then wipe
    setTimeout(() => {
      // Pass targetPath for navigation and targetHash for post-mount scroll
      executeTransition(targetPath || "/", router, targetHash);
    }, 150);

  }, [closeMenu, pathname, router]);

  useEffect(() => {
    return () => {
      clearStaggerTimers();
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <div className="nav-menu-root">
      <div className="nav-top-row">
        <button
          id="nav-menu-btn"
          className={`nav-menu-btn${open ? " is-open" : ""}`}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={handleToggle}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span className="nav-btn-label" aria-hidden="true">
            <span className="nav-btn-text" style={{ transform: open ? "translateY(-100%)" : "translateY(0%)" }}>
              Menu
            </span>
            <span className="nav-btn-close" style={{ transform: open ? "translateY(0%)" : "translateY(100%)" }}>
              Close
            </span>
          </span>
          <span className="nav-dot-wrap">
            <span
              className="nav-dots-icon"
              style={{
                transform: `rotate(${open || hovered ? 90 : 0}deg)`,
                transition: "transform 0.5s cubic-bezier(.22,.68,0,1.5)",
              }}
            >
              <DotsSVG />
            </span>
          </span>
        </button>
      </div>

      {mounted && (
        <div className={`nav-panel-wrapper${animated ? " nav-panel-open" : ""}`}>
          <nav className="nav-panel-box" aria-label="Site navigation">
            {NAV_LINKS.map((link, i) => (
              <div
                key={link.href}
                className={`nav-panel-item${visibleItems[i] ? " nav-panel-item-visible" : ""}`}
              >
                <a
                  href={link.href}
                  className="nav-panel-link"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  <span className="nav-arrow-wrap">
                    <ArrowSVG />
                  </span>
                  <span>{link.label}</span>
                </a>
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
