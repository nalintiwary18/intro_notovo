import React from "react";
import NavMenu from "../components/NavMenu";

export default function CompanyPage() {
  return (
    <div className="landing-container" style={{ minHeight: '100vh', padding: '150px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <NavMenu />
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <h1 className="working-title text-gradient gsap-text" style={{ opacity: 1, transform: 'none', marginBottom: '60px', textAlign: 'center', fontSize: 'clamp(40px, 6vw, 84px)' }}>Company</h1>
        
        <div style={{ fontFamily: 'var(--secondary-font)', fontSize: 'clamp(18px, 1.8vw, 24px)', color: 'rgba(50,50,50,0.85)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '40px', fontWeight: '500', color: 'var(--fg)', fontSize: 'clamp(20px, 2vw, 30px)' }}>
            Notovo is entirely dedicated to changing how notes are made.
          </p>
          <p style={{ marginBottom: '30px' }}>
            We believe that structured, deep-learning material should be intrinsically accessible to anyone. We exist to build experiences that systematically extract the vital signal from the raw noise of endless data, formatting knowledge into its purest state.
          </p>
          <p style={{ marginBottom: '30px' }}>
            Our mission is to empower researchers, students, and professionals with a canvas that organizes immense context without overwhelming the user—curating knowledge without compromising aesthetics.
          </p>
        </div>
      </div>
    </div>
  );
}
