import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: number;
}

export default function SchoolLogo({ className = '', size = 48 }: SchoolLogoProps) {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-sm transition-transform hover:scale-105 ${className}`}
      aria-label="Logo SMP Negeri 1 Ngawi"
    >
      {/* Outer Shield Border (Electric Royal Blue) */}
      <path
        d="M6 6H94V84L50 110L6 84V6Z"
        fill="#1E50E2"
      />

      {/* Inner Shield (Left Dark Navy, Right Cyan) */}
      {/* Left Navy Half */}
      <path
        d="M10 10H50V105L10 82V10Z"
        fill="#232F85"
      />

      {/* Right Cyan Half */}
      <path
        d="M50 10H90V82L50 105V10Z"
        fill="#0097DF"
      />

      {/* Background Accent Stripe */}
      <rect x="10" y="20" width="80" height="8" fill="#1C3F9F" opacity="0.8" />
      <rect x="30" y="10" width="8" height="95" fill="#0086CE" opacity="0.5" />

      {/* Text "SMP" (White) */}
      <text
        x="18"
        y="30"
        fill="#FFFFFF"
        fontFamily="serif"
        fontWeight="900"
        fontSize="17"
        letterSpacing="1"
      >
        SMP
      </text>

      {/* Golden Star (Top Right) */}
      <polygon
        points="75,15 78,23 86,23 80,28 82,36 75,31 68,36 70,28 64,23 72,23"
        fill="#FFE500"
        stroke="#E5C300"
        strokeWidth="0.5"
      />

      {/* Bold Number "1" (Golden Yellow) */}
      <path
        d="M18 41H32V75H23V50H18V41Z"
        fill="#FFE500"
      />

      {/* Open Book (White with black lines and dark base) */}
      <g transform="translate(24, 45)">
        {/* Book shadow/base */}
        <path
          d="M26 39L8 35C15 37 26 34 26 34C26 34 37 37 44 35L26 39Z"
          fill="#1A1A1A"
        />

        {/* Book Pages */}
        <path
          d="M26 3L4 12C12 30 14 32 26 36C38 32 40 30 48 12L26 3Z"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="1.2"
        />

        {/* Center fold */}
        <line x1="26" y1="3" x2="26" y2="36" stroke="#1E293B" strokeWidth="1.2" />

        {/* Page text lines (Left) */}
        <line x1="9" y1="14" x2="23" y2="11" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="10" y1="18" x2="23" y2="16" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="11" y1="22" x2="23" y2="20" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="12" y1="26" x2="23" y2="24" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="13" y1="30" x2="23" y2="28" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />

        {/* Page text lines (Right) */}
        <line x1="29" y1="11" x2="43" y2="14" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="29" y1="16" x2="42" y2="18" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="29" y1="20" x2="41" y2="22" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="29" y1="24" x2="40" y2="26" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="29" y1="28" x2="39" y2="30" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />

        {/* Feather Quill (Pena Bulu) */}
        <path
          d="M48 -5C44 2 37 13 30 22L32 23C38 15 45 4 48 -5Z"
          fill="#FFFFFF"
          stroke="#1E293B"
          strokeWidth="0.8"
        />
        <line x1="48" y1="-5" x2="30" y2="22" stroke="#1E293B" strokeWidth="0.8" />
        {/* Quill vanes */}
        <line x1="45" y1="-1" x2="41" y2="0" stroke="#1E293B" strokeWidth="0.6" />
        <line x1="42" y1="4" x2="38" y2="5" stroke="#1E293B" strokeWidth="0.6" />
        <line x1="39" y1="8" x2="35" y2="9" stroke="#1E293B" strokeWidth="0.6" />
        <line x1="36" y1="13" x2="32" y2="14" stroke="#1E293B" strokeWidth="0.6" />
      </g>

      {/* Text "NGAWI" (Golden Yellow) */}
      <text
        x="50"
        y="95"
        textAnchor="middle"
        fill="#FFE500"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="13"
        letterSpacing="1.5"
      >
        NGAWI
      </text>
    </svg>
  );
}
