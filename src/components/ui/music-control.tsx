import React, { useEffect } from 'react';
import { useMusic } from '../../contexts/MusicContext';

const MusicControl: React.FC = () => {
  const { isPlaying, toggleMusic, initializeMusic, error } = useMusic();

  // Set up event listener for first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initializeMusic();
      // Remove event listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [initializeMusic]);

  // If there's an error, don't show the control
  if (error) {
    console.error("Music error:", error);
    return null;
  }

  return (
    <button 
      onClick={toggleMusic}
      className="fixed bottom-4 right-4 z-50 bg-primary hover:bg-primary-dark text-white rounded-full p-3 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={isPlaying ? "Pause music" : "Play music"}
      title={isPlaying ? "Pause background music" : "Play background music"}
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      )}
    </button>
  );
};

export default MusicControl;