"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GSAPButton from "./components/GSAPButton";
import NavMenu from "./components/NavMenu";
import Preloader from "./components/Preloader";

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);

    // Animate hero elements in immediately after preloader fades out
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const heroItems = heroEl.querySelectorAll(".hero-entrance");
    gsap.fromTo(
      heroItems,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
      }
    );
  }, []);

  useGSAP(
    () => {
      // Bugs 2 + 17: Register plugins inside the hook, not at module scope
      gsap.registerPlugin(ScrollTrigger, useGSAP);

      // 1. Reveal animations for all standard text elements
      const texts = gsap.utils.toArray<HTMLElement>(".gsap-text");
      texts.forEach((text) => {
        gsap.to(text, {
          scrollTrigger: {
            trigger: text,
            start: "top 100%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        // Bug 8: Scope all DOM queries to the container ref
        const workingSection = container.current?.querySelector(".working-scroll-container");
        const workingSlides = gsap.utils.toArray<HTMLElement>(".working-slide-content");
        const workingImages = gsap.utils.toArray<HTMLElement>(".working-slide-image");
        const timelineIndicator = container.current?.querySelector<HTMLElement>(".working-timeline-indicator");
        const flowSteps = gsap.utils.toArray<HTMLElement>(".flow-step");

        if (workingSection && workingSlides.length > 0) {
          gsap.set(workingSlides, { autoAlpha: 0, y: 50 });
          gsap.set(workingImages, { autoAlpha: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: workingSection,
              start: "center center",
              end: `+=${workingSlides.length * 1000}`,
              pin: true,
              scrub: 1,
            },
          });

          workingSlides.forEach((slide, index) => {
            const isLast = index === workingSlides.length - 1;

            tl.to(slide, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }, index === 0 ? 0 : ">");
            tl.to(workingImages[index], { autoAlpha: 1, duration: 1 }, "<");

            // Move timeline indicator (guard for undefined)
            if (timelineIndicator) {
              tl.to(timelineIndicator, {
                top: `${20 + (index / (workingSlides.length - 1)) * 60}%`,
                duration: 1,
              }, "<");
            }

            // Bug 14: Reset ALL steps first, then highlight current one
            tl.to(flowSteps, { background: "#d9d9d9", color: "#000", duration: 0.5 }, "<");
            tl.to(flowSteps[index], { background: "#3e3e3e", color: "#fff", duration: 0.5 }, "<");

            tl.to(slide, { duration: 1.5 });

            if (!isLast) {
              tl.to(slide, { autoAlpha: 0, y: -50, duration: 1, ease: "power2.in" });
              tl.to(workingImages[index], { autoAlpha: 0, duration: 1 }, "<");
            }
          });
        }

        // 3. Movement-only Card Stacking Animation (Design request: no opacity tweens)
        const cardsWrapper = container.current?.querySelector(".cinematic-cards-wrapper");
        const cards = gsap.utils.toArray<HTMLElement>(".cinematic-card");

        if (cardsWrapper && cards.length > 0) {
          // Start all cards below the visible area — clipped by overflow:hidden on wrapper
          gsap.set(cards, { y: 700 });

          const cardsTl = gsap.timeline({
            scrollTrigger: {
              trigger: cardsWrapper,
              start: "center center",
              end: "+=3000",
              pin: true,
              scrub: 1,
            },
          });

          cards.forEach((card, index) => {
            const targetY = index * 18; // stacking offset

            // Slide this card up from below into its stacked position
            cardsTl.to(card, { y: targetY, duration: 1, ease: "power2.out" });

            if (index > 0) {
              // Push previous cards up slightly and scale them back (deck effect)
              const prev = cards.slice(0, index);
              cardsTl.to(
                prev,
                {
                  scale: (i: number) => 1 - (index - i) * 0.02,
                  y: (i: number) => i * 18 - (index - i) * 10,
                  duration: 1,
                },
                "<"
              );
            }

            // Hold this card in view before the next one arrives
            cardsTl.to(card, { duration: 1.5 });
          });
        }
      });
    },
    { scope: container }
  );

  const featureCardsData = [
    {
      title: ["Smart Notes from", "Any Material"],
      desc: "Upload PDFs, DOCX, or syllabus text and turn them into clean, structured, handwritten-style notes ready for revision.",
    },
    {
      title: ["Planning", "Before Generation"],
      desc: "Notovo analyzes your content first, builds a structure, and decides what needs depth — so notes feel intentional, not random.",
    },
    {
      title: ["Depth-Aware", "Learning"],
      desc: "Important topics are explained in detail, while smaller ones stay concise, helping you focus without overload.",
    },
    {
      title: ["Edit with", "AI"],
      desc: "Highlight any section and tell AI what to change — rewrite, simplify, or expand without breaking the document.",
    },
    {
      title: ["Version", "Control"],
      desc: "Every major change creates a new version, so you can experiment freely and always go back if needed.",
    },
  ];

  return (
    <>
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
    <div
      className="landing-container"
      ref={container}
      style={{
        opacity: preloaderDone ? 1 : 0,
        transition: "opacity 0.01s",
        pointerEvents: preloaderDone ? "auto" : "none",
      }}
    >
      <NavMenu />

      <section id="hero" className="hero-section" ref={heroRef}>
        <h1 className="hero-logo-small hero-entrance">Notovo</h1>
        {/* Bug 9: Removed inline transform — positioning handled purely in CSS */}
        <h1 className="hero-logo-large hero-entrance">Notovo</h1>
        <p className="hero-tagline hero-entrance">Changing how notes are made.</p>

        {/* Bug 5: Use Next.js <Image> for optimisation; width/height match CSS */}
        <Image
          src="/assets/pen2_1.png"
          alt="Pen illustration"
          className="hero-pen-img hero-entrance"
          width={550}
          height={700}
          priority
        />

        <GSAPButton className="try-now-btn hero-entrance" label="Try Now" onClick={() => window.location.href = 'https://app.notovo.in'} />
      </section>

      <section id="working" className="working-section">
        <div className="working-top">
          <div className="section-label gsap-text">Working</div>
          <h2 className="working-title text-gradient gsap-text">From Raw <span className="material-text">Material</span> to Structured Notes</h2>
        </div>

        <div className="working-scroll-container">
          <div className="working-scroll-main">
            <div className="working-scroll-left">
              <div className="working-timeline-indicator" />
              <div className="working-slide-content">
                <h3 className="working-subtitle">Smart Notes Generation</h3>
                <p className="working-desc">Turns messy content into readable notes.</p>
              </div>
              <div className="working-slide-content">
                <h3 className="working-subtitle">AI-Driven Summaries</h3>
                <p className="working-desc">Extract key concepts automatically from your raw material.</p>
              </div>
              <div className="working-slide-content">
                <h3 className="working-subtitle">Contextual Linking</h3>
                <p className="working-desc">Connect related documents and ideas with zero effort.</p>
              </div>
              <div className="working-slide-content">
                <h3 className="working-subtitle">Final Refinement</h3>
                <p className="working-desc">Polish your notes until they&apos;re perfect for your learning style.</p>
              </div>
            </div>
            <div className="working-scroll-right">
              <div className="working-slide-image">
                <Image src="/assets/screenshot.png" alt="Working Preview" width={1000} height={600} className="working-screenshot" />
              </div>
              <div className="working-slide-image">
                <Image src="/assets/aidrivensummerization.png" alt="AI-Driven Summaries" width={1000} height={600} className="working-screenshot" />
              </div>
              <div className="working-slide-image">
                <Image src="/assets/conceptualinking.png" alt="Contextual Linking" width={1000} height={600} className="working-screenshot" />
              </div>
              <div className="working-slide-image">
                <Image src="/assets/finalrefinement.png" alt="Final Refinement" width={1000} height={600} className="working-screenshot" />
              </div>
            </div>
          </div>
        </div>

        <div className="flow-container gsap-text">
          <div className="flow-label">Flow</div>
          <div className="flow-steps">
            <div className="flow-step">Understand</div>
            <div className="flow-step">Planning</div>
            <div className="flow-step">Generate</div>
            <div className="flow-step">Refine</div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-label gsap-text">Features</div>
        <h2 className="features-title features-gradient gsap-text">
          Focused on learning that is structured, clear, and actually useful.
        </h2>

        <div className="cinematic-cards-wrapper">
          {featureCardsData.map((card, idx) => (
            <div key={idx} className={`cinematic-card card-${idx}`}>
              <div className="card-inner-element">
                <h3>
                  {card.title[0]}
                  <span>{card.title[1]}</span>
                </h3>
                <p>{card.desc}</p>
              </div>
              {/* Editorial index — top right */}
              <span className="card-index">0{idx + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="pricing-section">
        <div className="pricing-header">
          <div>
            <div className="section-label gsap-text">Pricing</div>
            <h2 className="pricing-title pricing-gradient-1 gsap-text">
              Designed to stay simple and affordable. Unlock more as you push the limits of your workflow.
            </h2>
          </div>
          {/* Bug 10: Removed duplicate "Menu" label that was mistakenly here */}
        </div>

        <div className="pricing-container gsap-text">
          <div className="pricing-cards">
            <div className="pricing-card">
              <div className="pricing-card-badge">Beta</div>
              <h3>Free</h3>
              <p className="subtitle">The Essential Curator</p>

              <div className="pricing-features">
                <div className="pricing-feature">
                  <img src="/assets/container.svg" alt="Included" /> Up to 10–20 page documents
                </div>
                <div className="pricing-feature">
                  <img src="/assets/container.svg" alt="Included" /> Core note generation
                </div>
                <div className="pricing-feature">
                  <img src="/assets/container.svg" alt="Included" /> AI editing
                </div>
                <div className="pricing-feature">
                  <img src="/assets/container.svg" alt="Included" /> Version control
                </div>
              </div>

              <button className="pricing-btn" onClick={() => window.location.href = 'https://app.notovo.in'}>Start Free</button>
            </div>

            <div className="pricing-card pricing-card-pro">
              <div className="pricing-card-badge pro">New</div>
              <h3>Pro</h3>
              <p className="subtitle">The Master Archivist</p>

              <div className="pricing-features pro">
                <div className="pricing-feature">
                  <img src="/assets/container1.svg" alt="Included" /> Larger documents
                </div>
                <div className="pricing-feature">
                  <img src="/assets/container1.svg" alt="Included" /> Advanced generation
                </div>
                <div className="pricing-feature">
                  <img src="/assets/container1.svg" alt="Included" /> More AI usage
                </div>
                <div className="pricing-feature">
                  <img src="/assets/container1.svg" alt="Included" /> Faster processing
                </div>
              </div>

              <button className="pricing-btn pro">Coming Soon</button>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="footer-section">
        <div className="footer-inner">
          <div className="footer-top gsap-text">
            <div className="footer-tagline-container">
              <div className="footer-tagline">Built for Real Learning</div>
              <div className="footer-copyright" style={{ 
                marginTop: '32px', 
                fontFamily: 'var(--secondary-font)', 
                fontSize: '13px', 
                color: 'var(--footer-links-fg)' 
              }}>
                © 2026 Notovo. All rights reserved.
              </div>
            </div>
            {/* Bug 18: Footer links now have <a> tags */}
            <div className="footer-links">
              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li><a href="/terms">Terms of Use</a></li>
                  <li><a href="/company">Company</a></li>
                  <li><a href="/about">About Us</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Contacts</h4>
                <ul>
                  <li><a href="mailto:nalinkt.23@gmail.com">Email</a></li>
                  <li><a href="https://www.linkedin.com/in/kumarnalin" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                  <li><a href="https://www.instagram.com/__n_k_t___?igsh=Mmk4Zng4bGxuaHpy" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-logo gsap-text">Notovo</div>
        </div>
      </section>
    </div>
    </>
  );
}
