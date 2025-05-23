import React from 'react';

export const Header = () => {
  return (
    <header className="w-full border-b sticky top-0 z-50 bg-foreground/99 backdrop-blur-md text-white w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-3xl sm:text-4xl font-bold text-foreground">NEW ARRIVAL</div>
      </div>
    </header>
  );
}; 