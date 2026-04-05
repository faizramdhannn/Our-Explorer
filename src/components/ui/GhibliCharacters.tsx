'use client';
import React from 'react';

// Totoro - Big friendly forest spirit
export function TotoroSVG({ className = '', size = 120 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 130" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="60" cy="80" rx="42" ry="45" fill="#6B7B6B" />
      {/* Belly */}
      <ellipse cx="60" cy="88" rx="25" ry="30" fill="#D8D8C0" />
      {/* Belly pattern - chest marks */}
      <ellipse cx="52" cy="78" rx="5" ry="6" fill="#8B9B8B" opacity="0.6" />
      <ellipse cx="60" cy="72" rx="5" ry="6" fill="#8B9B8B" opacity="0.6" />
      <ellipse cx="68" cy="78" rx="5" ry="6" fill="#8B9B8B" opacity="0.6" />
      {/* Head */}
      <ellipse cx="60" cy="42" rx="34" ry="32" fill="#6B7B6B" />
      {/* Ears */}
      <polygon points="30,20 22,2 38,8" fill="#6B7B6B" />
      <polygon points="90,20 98,2 82,8" fill="#6B7B6B" />
      {/* Inner ears */}
      <polygon points="30,18 25,6 36,10" fill="#C8A0A0" />
      <polygon points="90,18 95,6 84,10" fill="#C8A0A0" />
      {/* Eyes */}
      <ellipse cx="46" cy="38" rx="10" ry="11" fill="white" />
      <ellipse cx="74" cy="38" rx="10" ry="11" fill="white" />
      <circle cx="48" cy="39" r="7" fill="#2A2A2A" />
      <circle cx="76" cy="39" r="7" fill="#2A2A2A" />
      {/* Eye shine */}
      <circle cx="50" cy="36" r="3" fill="white" />
      <circle cx="78" cy="36" r="3" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="50" rx="5" ry="3" fill="#4A3A3A" />
      {/* Whiskers */}
      <line x1="20" y1="48" x2="48" y2="51" stroke="#D4C4A0" strokeWidth="1.5" />
      <line x1="20" y1="54" x2="48" y2="54" stroke="#D4C4A0" strokeWidth="1.5" />
      <line x1="72" y1="51" x2="100" y2="48" stroke="#D4C4A0" strokeWidth="1.5" />
      <line x1="72" y1="54" x2="100" y2="54" stroke="#D4C4A0" strokeWidth="1.5" />
      {/* Smile */}
      <path d="M 50 58 Q 60 65 70 58" fill="none" stroke="#4A3A3A" strokeWidth="2" strokeLinecap="round" />
      {/* Paws */}
      <ellipse cx="30" cy="112" rx="12" ry="8" fill="#6B7B6B" />
      <ellipse cx="90" cy="112" rx="12" ry="8" fill="#6B7B6B" />
      {/* Claws */}
      <line x1="24" y1="118" x2="22" y2="124" stroke="#4A5A4A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="119" x2="30" y2="126" stroke="#4A5A4A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="36" y1="118" x2="38" y2="124" stroke="#4A5A4A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tail */}
      <path d="M 96 95 Q 115 80 108 65 Q 102 55 108 45" fill="none" stroke="#6B7B6B" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

// Soot Sprite (Susuwatari)
export function SootSpriteSVG({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="22" r="16" fill="#2A2A2A" />
      {/* Fuzzy edges */}
      <circle cx="8" cy="14" r="4" fill="#2A2A2A" />
      <circle cx="32" cy="14" r="4" fill="#2A2A2A" />
      <circle cx="6" cy="24" r="3" fill="#2A2A2A" />
      <circle cx="34" cy="24" r="3" fill="#2A2A2A" />
      <circle cx="12" cy="34" r="3" fill="#2A2A2A" />
      <circle cx="28" cy="34" r="3" fill="#2A2A2A" />
      {/* Eyes */}
      <circle cx="14" cy="20" r="5" fill="white" />
      <circle cx="26" cy="20" r="5" fill="white" />
      <circle cx="15" cy="20" r="3" fill="#FF6B6B" />
      <circle cx="27" cy="20" r="3" fill="#FF6B6B" />
      <circle cx="16" cy="19" r="1.5" fill="#1A1A1A" />
      <circle cx="28" cy="19" r="1.5" fill="#1A1A1A" />
      {/* Star/candy it holds */}
      <circle cx="20" cy="32" r="4" fill="#FFD700" opacity="0.9" />
      <path d="M20 28 L21.2 31.6 L25 31.6 L22 33.8 L23.2 37.4 L20 35.2 L16.8 37.4 L18 33.8 L15 31.6 L18.8 31.6 Z" fill="#FFE44D" />
    </svg>
  );
}

// Calcifer - Fire demon
export function CalciferSVG({ className = '', size = 60 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 70" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer flame */}
      <path d="M30 65 C10 65 5 50 8 38 C4 42 2 35 6 28 C10 21 8 12 14 8 C12 16 18 18 20 14 C22 10 25 5 30 2 C35 5 38 10 40 14 C42 18 48 16 46 8 C52 12 50 21 54 28 C58 35 56 42 52 38 C55 50 50 65 30 65Z" fill="#FF6B00" />
      {/* Inner flame */}
      <path d="M30 60 C15 60 12 48 14 38 C11 40 9 35 12 30 C14 25 13 18 18 15 C17 21 21 22 23 19 C25 16 27 10 30 8 C33 10 35 16 37 19 C39 22 43 21 42 15 C47 18 46 25 48 30 C51 35 49 40 46 38 C48 48 45 60 30 60Z" fill="#FFAA00" />
      {/* Core */}
      <ellipse cx="30" cy="45" rx="14" ry="14" fill="#FFD700" />
      {/* Face */}
      <ellipse cx="24" cy="42" rx="6" ry="7" fill="#1A1A1A" />
      <ellipse cx="36" cy="42" rx="6" ry="7" fill="#1A1A1A" />
      <circle cx="25" cy="40" r="3" fill="white" />
      <circle cx="37" cy="40" r="3" fill="white" />
      <circle cx="26" cy="41" r="2" fill="#4A2A00" />
      <circle cx="38" cy="41" r="2" fill="#4A2A00" />
      {/* Eyebrow angry */}
      <path d="M19 36 L29 38" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 38 L41 36" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      {/* Mouth */}
      <path d="M22 52 Q30 58 38 52" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 52 Q30 56 36 52" fill="#FF4500" />
    </svg>
  );
}

// Kodama - Tree spirit
export function KodamaSVG({ className = '', size = 50 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 60" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="25" cy="40" rx="14" ry="16" fill="white" opacity="0.9" />
      {/* Head */}
      <ellipse cx="25" cy="20" rx="16" ry="18" fill="white" opacity="0.95" />
      {/* Head marking */}
      <path d="M18 14 Q25 10 32 14" fill="none" stroke="#D4E8D4" strokeWidth="1.5" />
      {/* Eyes - hollow circles */}
      <circle cx="19" cy="20" r="4" fill="none" stroke="#2A4A2A" strokeWidth="2" />
      <circle cx="31" cy="20" r="4" fill="none" stroke="#2A4A2A" strokeWidth="2" />
      <circle cx="19" cy="20" r="2" fill="#2A4A2A" />
      <circle cx="31" cy="20" r="2" fill="#2A4A2A" />
      {/* Rattle head movement - subtle marks */}
      <circle cx="13" cy="16" r="2" fill="#D0E8D0" opacity="0.6" />
      <circle cx="37" cy="16" r="2" fill="#D0E8D0" opacity="0.6" />
      {/* Smile */}
      <path d="M20 28 Q25 32 30 28" fill="none" stroke="#4A6A4A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="19" cy="54" rx="6" ry="4" fill="white" opacity="0.9" />
      <ellipse cx="31" cy="54" rx="6" ry="4" fill="white" opacity="0.9" />
    </svg>
  );
}

// No-Face (Kaonashi)
export function NoFaceSVG({ className = '', size = 70 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 70 90" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Robe/Body */}
      <path d="M15 40 Q10 70 10 85 L60 85 Q60 70 55 40 Z" fill="#2A2A3A" opacity="0.85" />
      {/* Arms/sleeves */}
      <path d="M15 55 Q5 60 8 70 Q15 75 20 65" fill="#2A2A3A" opacity="0.85" />
      <path d="M55 55 Q65 60 62 70 Q55 75 50 65" fill="#2A2A3A" opacity="0.85" />
      {/* Head */}
      <ellipse cx="35" cy="25" rx="22" ry="24" fill="white" opacity="0.95" />
      {/* Mask lines */}
      <path d="M18 18 Q35 12 52 18" fill="none" stroke="#D0D0D8" strokeWidth="1" opacity="0.5" />
      {/* Eyes - slits */}
      <ellipse cx="26" cy="22" rx="5" ry="3" fill="#1A1A2A" />
      <ellipse cx="44" cy="22" rx="5" ry="3" fill="#1A1A2A" />
      {/* Mouth */}
      <path d="M24 32 Q35 38 46 32" fill="none" stroke="#1A1A2A" strokeWidth="2" strokeLinecap="round" />
      {/* Markings on mask */}
      <path d="M13 26 L22 26" stroke="#C0C0C8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 26 L57 26" stroke="#C0C0C8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Gold on hands */}
      <circle cx="8" cy="68" r="5" fill="#FFD700" opacity="0.8" />
      <circle cx="62" cy="68" r="5" fill="#FFD700" opacity="0.8" />
    </svg>
  );
}

// Jiji - Black cat from Kiki's Delivery Service
export function JijiSVG({ className = '', size = 60 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 80" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="30" cy="55" rx="18" ry="20" fill="#1A1A1A" />
      {/* Head */}
      <ellipse cx="30" cy="28" rx="18" ry="18" fill="#1A1A1A" />
      {/* Ears */}
      <polygon points="14,16 10,2 22,10" fill="#1A1A1A" />
      <polygon points="46,16 50,2 38,10" fill="#1A1A1A" />
      {/* Inner ears */}
      <polygon points="15,14 12,5 21,10" fill="#C8A0A8" />
      <polygon points="45,14 48,5 39,10" fill="#C8A0A8" />
      {/* White chest */}
      <ellipse cx="30" cy="60" rx="10" ry="12" fill="white" opacity="0.9" />
      {/* Eyes */}
      <ellipse cx="22" cy="27" rx="7" ry="7.5" fill="#FFD700" />
      <ellipse cx="38" cy="27" rx="7" ry="7.5" fill="#FFD700" />
      <ellipse cx="22" cy="27" rx="3.5" ry="6" fill="#1A0A0A" />
      <ellipse cx="38" cy="27" rx="3.5" ry="6" fill="#1A0A0A" />
      <circle cx="21" cy="25" r="1.5" fill="white" />
      <circle cx="37" cy="25" r="1.5" fill="white" />
      {/* Nose */}
      <path d="M27 34 L30 36 L33 34 Q30 38 27 34Z" fill="#E87070" />
      {/* Whiskers */}
      <line x1="8" y1="32" x2="22" y2="34" stroke="#AAA" strokeWidth="1" />
      <line x1="8" y1="36" x2="22" y2="36" stroke="#AAA" strokeWidth="1" />
      <line x1="38" y1="34" x2="52" y2="32" stroke="#AAA" strokeWidth="1" />
      <line x1="38" y1="36" x2="52" y2="36" stroke="#AAA" strokeWidth="1" />
      {/* Tail */}
      <path d="M48 65 Q62 55 58 40 Q55 30 58 20" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
      {/* Paws */}
      <ellipse cx="18" cy="74" rx="8" ry="5" fill="#1A1A1A" />
      <ellipse cx="42" cy="74" rx="8" ry="5" fill="#1A1A1A" />
    </svg>
  );
}

// Catbus
export function CatbusSVG({ className = '', size = 100 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 160 96" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Bus body */}
      <rect x="10" y="20" width="140" height="60" rx="20" fill="#D4A855" />
      {/* Stripes */}
      <rect x="10" y="38" width="140" height="4" fill="#C49040" />
      <rect x="10" y="52" width="140" height="4" fill="#C49040" />
      {/* Windows */}
      <rect x="22" y="26" width="20" height="16" rx="4" fill="#E8F4FF" opacity="0.8" />
      <rect x="48" y="26" width="20" height="16" rx="4" fill="#E8F4FF" opacity="0.8" />
      <rect x="74" y="26" width="20" height="16" rx="4" fill="#E8F4FF" opacity="0.8" />
      <rect x="100" y="26" width="20" height="16" rx="4" fill="#E8F4FF" opacity="0.8" />
      <rect x="126" y="26" width="18" height="16" rx="4" fill="#E8F4FF" opacity="0.8" />
      {/* Eyes */}
      <circle cx="20" cy="36" r="12" fill="white" />
      <circle cx="22" cy="36" r="8" fill="#FFD700" />
      <ellipse cx="22" cy="36" rx="4" ry="7" fill="#1A1A1A" />
      <circle cx="20" cy="33" r="2" fill="white" />
      {/* Ears */}
      <polygon points="8,22 2,8 18,14" fill="#D4A855" />
      <polygon points="22,20 16,8 28,12" fill="#C49040" />
      {/* Legs */}
      {[25, 50, 75, 100, 125].map((x, i) => (
        <React.Fragment key={i}>
          <rect x={x} y="78" width="10" height="14" rx="5" fill="#C49040" />
          <ellipse cx={x + 5} cy="93" rx="7" ry="4" fill="#B88030" />
        </React.Fragment>
      ))}
      {/* Tail */}
      <path d="M148 50 Q165 40 160 25 Q156 15 162 8" fill="none" stroke="#D4A855" strokeWidth="6" strokeLinecap="round" />
      {/* Smile */}
      <path d="M8 46 Q10 50 14 48" fill="none" stroke="#8B6020" strokeWidth="1.5" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="2" y1="36" x2="14" y2="38" stroke="#C8B870" strokeWidth="1" />
      <line x1="2" y1="40" x2="14" y2="40" stroke="#C8B870" strokeWidth="1" />
    </svg>
  );
}

// Spirited Away - Haku dragon spirit
export function HakuSVG({ className = '', size = 80 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 160 80" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Dragon body */}
      <path d="M10 40 Q40 20 80 38 Q120 56 150 30" fill="none" stroke="#A8D8EA" strokeWidth="14" strokeLinecap="round" />
      <path d="M10 40 Q40 22 80 40 Q120 58 150 32" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      {/* Head */}
      <ellipse cx="150" cy="30" rx="14" ry="10" fill="#A8D8EA" />
      {/* Mane */}
      <path d="M140 24 Q145 18 150 20" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M144 20 Q150 12 155 18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="156" cy="28" r="3" fill="#FFD700" />
      <circle cx="156" cy="28" r="1.5" fill="#1A1A1A" />
      {/* Whiskers */}
      <path d="M158 30 Q166 26 162 22" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M158 32 Q168 32 164 28" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Scales pattern */}
      {[30, 60, 90, 120].map((x, i) => (
        <circle key={i} cx={x} cy={38 + (i % 2) * 4} r="4" fill="none" stroke="#88C8D8" strokeWidth="1" opacity="0.5" />
      ))}
      {/* Tail */}
      <path d="M10 40 Q2 50 6 60" fill="none" stroke="#A8D8EA" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

// Small totoro / Chibi totoro
export function ChibiTotoroSVG({ className = '', size = 50 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 55" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="25" cy="35" rx="18" ry="18" fill="#88A888" />
      {/* Belly */}
      <ellipse cx="25" cy="38" rx="10" ry="12" fill="#D8D8B8" />
      {/* Head */}
      <ellipse cx="25" cy="18" rx="16" ry="15" fill="#88A888" />
      {/* Ears */}
      <polygon points="12,10 8,0 18,4" fill="#88A888" />
      <polygon points="38,10 42,0 32,4" fill="#88A888" />
      {/* Eyes */}
      <circle cx="19" cy="16" r="5.5" fill="white" />
      <circle cx="31" cy="16" r="5.5" fill="white" />
      <circle cx="20" cy="17" r="4" fill="#1A1A1A" />
      <circle cx="32" cy="17" r="4" fill="#1A1A1A" />
      <circle cx="21" cy="15" r="1.5" fill="white" />
      <circle cx="33" cy="15" r="1.5" fill="white" />
      {/* Nose */}
      <circle cx="25" cy="22" r="2.5" fill="#3A2A2A" />
      {/* Smile */}
      <path d="M21 26 Q25 29 29 26" fill="none" stroke="#3A2A2A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="8" y1="20" x2="18" y2="22" stroke="#C8B870" strokeWidth="1" />
      <line x1="32" y1="22" x2="42" y2="20" stroke="#C8B870" strokeWidth="1" />
      {/* Feet */}
      <ellipse cx="16" cy="51" rx="7" ry="4" fill="#88A888" />
      <ellipse cx="34" cy="51" rx="7" ry="4" fill="#88A888" />
    </svg>
  );
}

// Ponyo
export function PonyoSVG({ className = '', size = 60 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Fish tail */}
      <path d="M30 40 Q10 50 5 60 Q20 55 30 50 Q40 55 55 60 Q50 50 30 40Z" fill="#FF8888" />
      {/* Body */}
      <ellipse cx="30" cy="32" rx="22" ry="18" fill="#FFB8B8" />
      {/* Face */}
      <ellipse cx="30" cy="26" rx="18" ry="18" fill="#FFD0C0" />
      {/* Hair */}
      <path d="M12 22 Q15 8 30 10 Q45 8 48 22" fill="#CC4444" />
      <path d="M10 24 Q6 14 14 10 Q12 20 14 24" fill="#CC4444" />
      <path d="M50 24 Q54 14 46 10 Q48 20 46 24" fill="#CC4444" />
      {/* Eyes */}
      <circle cx="23" cy="24" r="5" fill="#2A1A1A" />
      <circle cx="37" cy="24" r="5" fill="#2A1A1A" />
      <circle cx="24" cy="22" r="2" fill="white" />
      <circle cx="38" cy="22" r="2" fill="white" />
      {/* Cheeks */}
      <circle cx="18" cy="28" r="5" fill="#FF9090" opacity="0.5" />
      <circle cx="42" cy="28" r="5" fill="#FF9090" opacity="0.5" />
      {/* Nose */}
      <circle cx="30" cy="28" r="2" fill="#E87070" />
      {/* Mouth */}
      <path d="M24 33 Q30 37 36 33" fill="#E87070" />
      {/* Little hands */}
      <ellipse cx="10" cy="34" rx="5" ry="4" fill="#FFD0C0" />
      <ellipse cx="50" cy="34" rx="5" ry="4" fill="#FFD0C0" />
    </svg>
  );
}
