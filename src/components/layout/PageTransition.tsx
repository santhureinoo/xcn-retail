import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  
  // Store the previous path to determine transition direction
  const prevPathRef = useRef(location.pathname);
  
  useEffect(() => {
    // Skip transition on initial render
    if (prevPathRef.current === location.pathname) {
      return;
    }
    
    // Determine if we're navigating forward or backward
    const isNavigatingBack = prevPathRef.current.length > location.pathname.length || 
                            prevPathRef.current.split('/').length > location.pathname.split('/').length;
    
    // Start fade out transition
    setTransitionStage(isNavigatingBack ? 'fadeOutRight' : 'fadeOutLeft');
    
    // After the fade out, update the location and start fade in
    const timeout = setTimeout(() => {
      setDisplayLocation(location);
      setTransitionStage(isNavigatingBack ? 'fadeInLeft' : 'fadeInRight');
      prevPathRef.current = location.pathname;
    }, 300); // This should match the CSS transition duration
    
    return () => clearTimeout(timeout);
  }, [location]);
  
  return (
    <div
      className={`page-transition ${transitionStage}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;