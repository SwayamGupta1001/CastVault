import React, { useId } from 'react';

interface CastVaultLogoProps {
  className?: string;
}

export const CastVaultLogo: React.FC<CastVaultLogoProps> = ({ className = 'w-8 h-8' }) => {
  const id = useId().replace(/:/g, '');
  const bgGradId = `bgGrad_${id}`;
  const accentGradId = `accentGrad_${id}`;
  const metalGradId = `metalGrad_${id}`;
  const glowGradId = `glowGrad_${id}`;

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      className={className}
    >
      <defs>
        <linearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A"/>
          <stop offset="50%" stopColor="#090D16"/>
          <stop offset="100%" stopColor="#020617"/>
        </linearGradient>

        <linearGradient id={accentGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB7185"/>
          <stop offset="50%" stopColor="#E11D48"/>
          <stop offset="100%" stopColor="#9F1239"/>
        </linearGradient>

        <linearGradient id={metalGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="40%" stopColor="#E2E8F0"/>
          <stop offset="100%" stopColor="#64748B"/>
        </linearGradient>

        <linearGradient id={glowGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FB7185" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Base App Icon */}
      <rect width="512" height="512" rx="112" fill={`url(#${bgGradId})`}/>
      <rect x="6" y="6" width="500" height="500" rx="106" fill="none" stroke="#334155" strokeWidth="2.5" strokeOpacity="0.4"/>

      {/* Left Precision Bracket [ (Scale Caliper) */}
      <path d="M 126 160 L 78 160 Q 64 160 64 174 L 64 338 Q 64 352 78 352 L 126 352" 
            fill="none" stroke={`url(#${accentGradId})`} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Caliper Measurement Hash Marks */}
      <line x1="64" y1="210" x2="84" y2="210" stroke={`url(#${accentGradId})`} strokeWidth="6" strokeLinecap="round"/>
      <line x1="64" y1="256" x2="96" y2="256" stroke={`url(#${accentGradId})`} strokeWidth="8" strokeLinecap="round"/>
      <line x1="64" y1="302" x2="84" y2="302" stroke={`url(#${accentGradId})`} strokeWidth="6" strokeLinecap="round"/>

      {/* Right Precision Bracket ] (Scale Caliper) */}
      <path d="M 386 160 L 434 160 Q 448 160 448 174 L 448 338 Q 448 352 434 352 L 386 352" 
            fill="none" stroke={`url(#${accentGradId})`} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Caliper Measurement Hash Marks */}
      <line x1="448" y1="210" x2="428" y2="210" stroke={`url(#${accentGradId})`} strokeWidth="6" strokeLinecap="round"/>
      <line x1="448" y1="256" x2="416" y2="256" stroke={`url(#${accentGradId})`} strokeWidth="8" strokeLinecap="round"/>
      <line x1="448" y1="302" x2="428" y2="302" stroke={`url(#${accentGradId})`} strokeWidth="6" strokeLinecap="round"/>

      {/* Subtle Surface / Ground Shadow */}
      <ellipse cx="256" cy="358" rx="146" ry="12" fill="#000000" opacity="0.6"/>

      {/* Center Diecast Body: Sleek GT Contour */}
      {/* 1. Greenhouse / Cockpit Canopy */}
      <path d="M 188 250 Q 236 182 292 184 Q 338 186 364 250 Z" 
            fill="#0B0F19" stroke={`url(#${metalGradId})`} strokeWidth="14" strokeLinejoin="round"/>

      {/* 2. Lower Bodywork Profile (Front splitter to rear ducktail spoiler) */}
      <path d="M 112 284 
               Q 138 274 172 266 
               L 368 266 
               Q 398 252 408 244 
               Q 412 258 402 284 
               L 404 298 
               Q 400 306 388 306 
               L 364 306
               A 36 36 0 0 0 292 306
               L 220 306
               A 36 36 0 0 0 148 306
               L 122 306
               Q 110 306 110 296 Z"
            fill={`url(#${metalGradId})`}/>

      {/* Front Wheel Assembly */}
      <circle cx="184" cy="306" r="32" fill="#020617"/>
      <circle cx="184" cy="306" r="26" fill="none" stroke="#334155" strokeWidth="3"/>
      <circle cx="184" cy="306" r="14" fill={`url(#${accentGradId})`}/>
      <circle cx="184" cy="306" r="5" fill="#FFFFFF"/>

      {/* Rear Wheel Assembly */}
      <circle cx="328" cy="306" r="32" fill="#020617"/>
      <circle cx="328" cy="306" r="26" fill="none" stroke="#334155" strokeWidth="3"/>
      <circle cx="328" cy="306" r="14" fill={`url(#${accentGradId})`}/>
      <circle cx="328" cy="306" r="5" fill="#FFFFFF"/>

      {/* Speedline Accent across Waistline */}
      <line x1="172" y1="272" x2="352" y2="272" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
    </svg>
  );
};
