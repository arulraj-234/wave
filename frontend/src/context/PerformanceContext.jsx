import React, { createContext, useContext, useState, useEffect } from 'react';

const PerformanceContext = createContext();

export const PerformanceProvider = ({ children }) => {
  const [reducedEffects, setReducedEffects] = useState(false);

  useEffect(() => {
    const checkPerformance = () => {
      // 1. Mobile width check
      const isMobileWidth = window.innerWidth < 768;
      
      // 2. Touch device check (heuristic for phones/tablets)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // 3. User OS preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // 4. Hardware limits
      const isLowCore = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isSlowConnection = connection && (connection.effectiveType === '2g' || connection.effectiveType === '3g');
      
      // If it's a mobile device OR user explicitly wants reduced motion OR it's a very weak PC
      if ((isMobileWidth && isTouchDevice) || prefersReducedMotion || isLowCore || isSlowConnection) {
        setReducedEffects(true);
      } else {
        setReducedEffects(false);
      }
    };

    // Initial check
    checkPerformance();

    // Re-check on resize (in case they drag window to mobile size and we want to drop heavy renders)
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkPerformance, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <PerformanceContext.Provider value={{ reducedEffects }}>
      {children}
    </PerformanceContext.Provider>
  );
};

// Primary access hook
export const usePerformance = () => {
  return useContext(PerformanceContext);
};

// Shorthand for semantic use inside motion components
export const useReducedMotion = () => {
  const { reducedEffects } = useContext(PerformanceContext);
  return reducedEffects;
};
