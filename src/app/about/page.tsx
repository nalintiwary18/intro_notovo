import React from "react";
import NavMenu from "../components/NavMenu";

export default function AboutPage() {
  return (
    <div className="landing-container" style={{ minHeight: '100vh', padding: '150px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <NavMenu />
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <h1 className="working-title text-gradient gsap-text" style={{ opacity: 1, transform: 'none', marginBottom: '60px', textAlign: 'center', fontSize: 'clamp(40px, 6vw, 84px)' }}>About Us</h1>
        
        <div style={{ fontFamily: 'var(--secondary-font)', fontSize: 'clamp(18px, 1.8vw, 24px)', color: 'rgba(50,50,50,0.85)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '40px', fontWeight: '500', color: 'var(--fg)', fontSize: 'clamp(20px, 2vw, 30px)' }}>
            We are a collective mapping the future of cognitive recording.
          </p>
          <p style={{ marginBottom: '30px' }}>
            Notovo started solely as an experiment in learning density. We recognized that the modern user wasn't lacking information—they were lacking focus. Every app promised boundless knowledge, but delivered chaotic text dumps.
          </p>
          <p style={{ marginBottom: '30px' }}>
            Our collective operates under a singular philosophy: UI exists only to clarify. We strip away the unnecessary, utilizing AI natively to structure your thoughts gracefully, and engineer high-end dynamic interfaces that make interactions feel cinematic, responsive, and permanent.
          </p>
        </div>
      </div>
    </div>
  );
}
