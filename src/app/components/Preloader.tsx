"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const plRef = useRef<HTMLDivElement>(null);
  const swRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLDivElement>(null);
  const wwRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sw = swRef.current!;
    const cur = curRef.current!;
    const ul = ulRef.current!;
    const ww = wwRef.current!;
    const pl = plRef.current!;
    // All refs are guaranteed to exist after mount: bail only if somehow not yet attached
    if (!sw || !cur || !ul || !ww || !pl) return;

    // Lock scroll while preloader is active
    document.body.classList.add("is-preloading");

    const DUR = 2600;
    const DELAY = 600;

    const timeout = setTimeout(() => {
      cur.style.opacity = "1";
      const total = ww.offsetWidth;
      const start = performance.now();

      function easeInOut(t: number) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function frame(now: number) {
        const t = Math.min((now - start) / DUR, 1);
        const p = easeInOut(t);
        const px = p * total;

        sw.style.width = px + "px";
        cur.style.left = px - 1 + "px";
        ul.style.width = px + "px";

        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          // Cursor blink-out
          cur.style.transition = "opacity 0.5s ease";
          cur.style.opacity = "0";

          // Brief hold, then fade-out the entire preloader overlay
          setTimeout(() => {
            gsap.to(pl, {
              opacity: 0,
              duration: 0.8,
              ease: "power2.inOut",
              onComplete: () => {
                document.body.classList.remove("is-preloading");
                pl.style.display = "none";
                // Signal Lenis (and anything else listening) that preloader is done
                window.dispatchEvent(new CustomEvent("preloader:complete"));
                onComplete();
              },
            });
          }, 300);
        }
      }

      requestAnimationFrame(frame);
    }, DELAY);

    return () => {
      clearTimeout(timeout);
      document.body.classList.remove("is-preloading");
    };
  }, [onComplete]);

  return (
    <div
      ref={plRef}
      id="notovo-preloader"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0c0c0c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Stage */}
      <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
        <div ref={wwRef} style={{ position: "relative", display: "inline-block" }}>
          {/* Ghost text (stroke outline) */}
          <span
            style={{
              fontSize: "clamp(56px, 9vw, 110px)",
              fontWeight: 300,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "transparent",
              WebkitTextStroke: "0.8px rgba(255,255,255,0.10)",
              display: "block",
              whiteSpace: "nowrap",
              userSelect: "none",
              fontFamily: "var(--font-josefin), sans-serif",
            }}
          >
            NOTOVO
          </span>

          {/* Solid fill — clipped by overflow:hidden on solid-wrap */}
          <div
            ref={swRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              overflow: "hidden",
              width: 0,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: "clamp(56px, 9vw, 110px)",
                fontWeight: 300,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#fff",
                display: "block",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-josefin), sans-serif",
              }}
            >
              NOTOVO
            </span>
          </div>

          {/* Cursor bar */}
          <div
            ref={curRef}
            style={{
              position: "absolute",
              top: "0px",
              left: 0,
              width: "2px",
              bottom: "10px",
              background: "#fff",
              opacity: 0,
            }}
          />

          {/* Underline track */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: 0,
              right: 0,
              height: "1px",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <div
              ref={ulRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: 0,
                background: "#fff",
                opacity: 0.4,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
