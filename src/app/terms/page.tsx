import React from "react";
import NavMenu from "../components/NavMenu";

export default function TermsPage() {
  return (
    <div className="landing-container" style={{ minHeight: '100vh', padding: '150px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <NavMenu />
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <h1 className="working-title text-gradient gsap-text" style={{ opacity: 1, transform: 'none', marginBottom: '60px', textAlign: 'center', fontSize: 'clamp(40px, 6vw, 84px)' }}>Terms of Use</h1>
        
        <div style={{ fontFamily: 'var(--secondary-font)', fontSize: 'clamp(16px, 1.5vw, 20px)', color: 'rgba(50,50,50,0.85)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px', fontWeight: 'bold' }}>Last updated: 2026</p>
          <p style={{ marginBottom: '40px', fontSize: 'clamp(18px, 1.8vw, 24px)', fontWeight: '500', color: 'var(--fg)' }}>
            Welcome to Notovo. By accessing or using our application, you agree to be bound by these Terms of Use and our Privacy Policy.
          </p>
          
          <h2 style={{ fontFamily: 'var(--primary-font)', fontSize: 'clamp(24px, 2.5vw, 36px)', marginTop: '60px', marginBottom: '24px', color: 'var(--fg)' }}>1. Use of the Service</h2>
          <p style={{ marginBottom: '30px' }}>
            You must use the Service in compliance with all applicable laws and regulations. You are responsible for all your activities under your account. The platform is designed to distill context seamlessly, and you agree not to interfere with the network operations or attempt unauthorized deep-learning extractions.
          </p>
          
          <h2 style={{ fontFamily: 'var(--primary-font)', fontSize: 'clamp(24px, 2.5vw, 36px)', marginTop: '60px', marginBottom: '24px', color: 'var(--fg)' }}>2. Content Ownership</h2>
          <p style={{ marginBottom: '30px' }}>
            You retain all rights and ownership to the raw material and content you provide to Notovo for processing. In return, you grant us a secure, encrypted license strictly for the purpose of generating your personal insights.
          </p>
        </div>
      </div>
    </div>
  );
}
