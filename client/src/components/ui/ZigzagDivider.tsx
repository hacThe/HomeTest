import React from 'react';

interface ZigzagDividerProps {
  className?: string;
}

export const ZigzagDivider: React.FC<ZigzagDividerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full h-auto"
        fill="currentColor"
      >
        <path d="M0,100 L100,50 L200,50 L300,100 L500,90 L650,60 L800,80 L950,60 L1100,80 L1300,60 L1440,90 L1440,100 L0,100 Z" />
      </svg>
    </div>
  );
}; 