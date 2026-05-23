import React from 'react'

export default function Logo({ className = "w-8 h-8", logoColorClass = "text-brand-500 dark:text-brand-400" }) {
  return (
    <svg
      className={`${className} ${logoColorClass}`}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cc-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <filter id="cc-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle cx="24" cy="24" r="20" stroke="url(#cc-gradient)" strokeWidth="2" className="opacity-30 dark:opacity-40" />

      {/* Compass needle stylized as neural link */}
      <path d="M24 10 L30 24 L24 38 L18 24 Z" fill="url(#cc-gradient)" filter="url(#cc-glow)" opacity="0.95" />

      {/* Neural nodes connected around needle */}
      <circle cx="24" cy="8" r="1.8" fill="#fff" stroke="url(#cc-gradient)" strokeWidth="1" />
      <circle cx="38" cy="18" r="1.8" fill="#fff" stroke="url(#cc-gradient)" strokeWidth="1" />
      <circle cx="10" cy="18" r="1.8" fill="#fff" stroke="url(#cc-gradient)" strokeWidth="1" />
      <circle cx="24" cy="40" r="1.8" fill="#fff" stroke="url(#cc-gradient)" strokeWidth="1" />

      {/* Connecting neural lines */}
      <path d="M24 10 L38 18" stroke="url(#cc-gradient)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M24 10 L10 18" stroke="url(#cc-gradient)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M24 38 L38 18" stroke="url(#cc-gradient)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M24 38 L10 18" stroke="url(#cc-gradient)" strokeWidth="1.2" strokeLinecap="round" />

      {/* Central hub */}
      <circle cx="24" cy="24" r="3" fill="#ffffff" stroke="url(#cc-gradient)" strokeWidth="1.6" className="dark:fill-slate-900" />
    </svg>
  )
}
