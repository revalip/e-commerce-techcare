import React from 'react';

/**
 * Minimalist TechCare Geometric Monogram Mark (T + C)
 * Matches Apple / Airform Studio palette (#1D2129 charcoal + #9BB0C9 silver-slate).
 */
export default function TechCareLogo({ size = 28, dark = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect
        width="100"
        height="100"
        rx="24"
        fill={dark ? '#FFFFFF' : '#1D2129'}
      />
      <path
        d="M21 32H45M33 32V68"
        stroke={dark ? '#1D2129' : '#FFFFFF'}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M77 39C74 34.5 69.5 32 64.5 32C56 32 50 39.8 50 50C50 60.2 56 68 64.5 68C69.5 68 74 65.5 77 61"
        stroke={dark ? '#4F627A' : '#9BB0C9'}
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
