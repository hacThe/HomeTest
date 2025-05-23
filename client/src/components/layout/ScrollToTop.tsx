'use client';

import { useState, useEffect } from 'react';
import { MoveUp, ChevronsUp } from 'lucide-react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 rounded-none bg-primary text-white shadow-lg transition-all duration-300 hover:bg-primary/90 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      } overflow-hidden`}
      aria-label="Scroll to top"
    >
      <div className="relative w-6 h-6">
        <MoveUp className="absolute w-6 h-6 text-black transition-all duration-300 group-hover:translate-y-[-150%]" />
        <ChevronsUp className="absolute w-6 h-6 text-black transition-all duration-300 translate-y-[150%] group-hover:translate-y-0" />
      </div>
    </button>
  );
}; 