"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface GSAPButtonProps {
  label?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * GSAPButton component based on user-provided design.
 * Features hover animations for background color, text color, and icon scaling.
 * Features a click animation for the icon rotation.
 */
const GSAPButton: React.FC<GSAPButtonProps> = ({ 
  label = "Try Now", 
  className = "", 
  onClick 
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const iconWrapRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  const timeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // Initial timeline for hover states
    timeline.current = gsap.timeline({ paused: true })
      .to(btnRef.current, { 
        backgroundColor: '#111', 
        color: '#fff', 
        duration: 0.35, 
        ease: 'power2.inOut' 
      }, 0)
      .to(iconWrapRef.current, { 
        width: 30, 
        height: 30, 
        backgroundColor: '#fff', 
        duration: 0.35, 
        ease: 'power2.inOut' 
      }, 0)
      .to(arrowRef.current, { 
        opacity: 1, 
        duration: 0.2, 
        ease: 'power2.out' 
      }, 0.15);
  }, { scope: btnRef });

  const handleMouseEnter = () => timeline.current?.play();
  const handleMouseLeave = () => timeline.current?.reverse();

  const handleMouseDown = () => {
    gsap.to(arrowRef.current, { 
      rotation: 45, 
      duration: 0.18, 
      ease: 'power2.out', 
      transformOrigin: '50% 50%' 
    });
  };

  const handleMouseUp = () => {
    gsap.to(arrowRef.current, { 
      rotation: 0, 
      duration: 0.18, 
      ease: 'power2.inOut', 
      transformOrigin: '50% 50%' 
    });
  };

  return (
    <button
      ref={btnRef}
      className={className}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderRadius: '9999px',
        background: '#e5e5e5',
        border: 'none',
        padding: '0 24px 0 12px',
        height: '50px',
        cursor: 'pointer',
        fontSize: '20px', // Matches landing page feel better than 14px
        fontWeight: '600',
        color: '#111',
        position: 'relative',
        transition: 'transform 0.2s ease',
        fontFamily: 'var(--primary-font)',
        zIndex: 10,
      }}
    >
      <span
        ref={iconWrapRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111',
          borderRadius: '9999px',
          width: '12px',
          height: '12px',
          flexShrink: 0,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <svg
          ref={arrowRef}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#111"
          strokeWidth="3" // Slightly bolder for visibility
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ 
            display: 'block', 
            opacity: 0, 
            position: 'absolute' 
          }}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
      <span>{label}</span>
    </button>
  );
};

export default GSAPButton;
