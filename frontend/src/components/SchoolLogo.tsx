import React from 'react';
import Image from 'next/image';

interface SchoolLogoProps {
  className?: string;
  size?: number;
}

export default function SchoolLogo({ className = '', size = 48 }: SchoolLogoProps) {
  return (
    <Image
      src="/smpn1.png"
      alt="Logo SMP Negeri 1 Ngawi"
      width={size}
      height={size}
      priority
      className={`shrink-0 object-contain transition-transform hover:scale-105 ${className}`}
      style={{ width: 'auto', height: size }}
    />
  );
}

