"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NavMenu from "../components/NavMenu";
import { blogUpdates } from "../../data/blogData";

export default function Blog() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

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
  }, { scope: container });

  return (
    <div ref={container} className="blog-page-container">
      <NavMenu />

      <section className="blog-page-hero">
        <div className="section-label gsap-text">Updates</div>
        <h1 className="blog-page-title gsap-text">
          Upcoming &amp; <span className="material-text">Latest</span>
        </h1>
      </section>

      <section className="blog-page-list">
        {blogUpdates.map((update) => (
          <article key={update.id} className="blog-page-card gsap-text">
            <div className="blog-page-card-meta">
              <span className={`blog-page-badge ${update.type === "Upcoming Update" ? "badge-upcoming" : "badge-info"}`}>
                {update.type}
              </span>
              {update.version && (
                <span className="blog-page-version">{update.version}</span>
              )}
              <span className="blog-page-date">{update.date}</span>
            </div>
            <h2 className="blog-page-card-title">{update.title}</h2>
            <p className="blog-page-card-desc">{update.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
