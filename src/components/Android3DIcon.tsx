import React from 'react';

interface Android3DIconProps {
  className?: string;
  size?: number | string;
}

export const Android3DIcon: React.FC<Android3DIconProps> = ({
  className = 'w-7 h-7',
  size,
}) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        {/* Ambient Drop Shadow */}
        <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="150%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#047857" floodOpacity="0.45" />
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#022c22" floodOpacity="0.6" />
        </filter>

        {/* Head Surface 3D Gradient */}
        <radialGradient
          id="head3dGrad"
          cx="42%"
          cy="28%"
          r="68%"
          fx="40%"
          fy="22%"
        >
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="35%" stopColor="#34d399" />
          <stop offset="70%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </radialGradient>

        {/* Specular Highlight on Head Dome */}
        <linearGradient id="headHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="30%" stopColor="#a7f3d0" stopOpacity="0.4" />
          <stop offset="85%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>

        {/* Antenna 3D Gradient */}
        <linearGradient id="antennaGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="45%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>

        <linearGradient id="antennaGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="45%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>

        {/* Eyes 3D Glow and Depth */}
        <radialGradient id="eyeGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f0fdf4" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>

        <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#064e3b" floodOpacity="0.5" />
        </filter>

        {/* Base Bevel */}
        <linearGradient id="baseBevel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="50%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>

        {/* Torso Cut / Collar 3D */}
        <linearGradient id="collarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* Group with 3D drop shadow */}
      <g filter="url(#shadow3d)">
        {/* Antennas */}
        {/* Left Antenna */}
        <rect
          x="30"
          y="15"
          width="6.5"
          height="22"
          rx="3.25"
          transform="rotate(-28 30 15)"
          fill="url(#antennaGradLeft)"
        />
        {/* Right Antenna */}
        <rect
          x="83"
          y="12"
          width="6.5"
          height="22"
          rx="3.25"
          transform="rotate(28 83 12)"
          fill="url(#antennaGradRight)"
        />

        {/* Android Dome Head Base */}
        <path
          d="M20 72 C20 40 38 25 60 25 C82 25 100 40 100 72 Z"
          fill="url(#head3dGrad)"
        />

        {/* Head Bevel Rim Bottom */}
        <path
          d="M20 71 C20 70 38 72 60 72 C82 72 100 70 100 71 C100 73.5 82 75 60 75 C38 75 20 73.5 20 71 Z"
          fill="url(#baseBevel)"
        />

        {/* 3D Curved Specular Dome Highlight */}
        <path
          d="M24 66 C26 43 41 29 60 29 C79 29 94 43 96 66 C88 47 75 35 60 35 C45 35 32 47 24 66 Z"
          fill="url(#headHighlight)"
        />

        {/* Soft Secondary Gloss Bubble */}
        <ellipse
          cx="46"
          cy="36"
          rx="12"
          ry="6"
          transform="rotate(-20 46 36)"
          fill="#ffffff"
          opacity="0.3"
        />

        {/* Left Eye */}
        <circle
          cx="43"
          cy="52"
          r="5"
          fill="url(#eyeGrad)"
          filter="url(#eyeGlow)"
        />
        <circle
          cx="41.5"
          cy="50.5"
          r="1.5"
          fill="#ffffff"
          opacity="0.9"
        />

        {/* Right Eye */}
        <circle
          cx="77"
          cy="52"
          r="5"
          fill="url(#eyeGrad)"
          filter="url(#eyeGlow)"
        />
        <circle
          cx="75.5"
          cy="50.5"
          r="1.5"
          fill="#ffffff"
          opacity="0.9"
        />

        {/* Lower Collar / Shoulders Strip (3D Body hint) */}
        <path
          d="M22 81 C22 79 38 80 60 80 C82 80 98 79 98 81 C98 90 85 96 60 96 C35 96 22 90 22 81 Z"
          fill="url(#collarGrad)"
        />
        {/* Collar Highlight */}
        <path
          d="M26 82 C38 83 48 83.5 60 83.5 C72 83.5 82 83 94 82 C86 86 74 88 60 88 C46 88 34 86 26 82 Z"
          fill="#a7f3d0"
          opacity="0.4"
        />
      </g>
    </svg>
  );
};
