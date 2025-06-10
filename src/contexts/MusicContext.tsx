import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
  initializeMusic: () => void;
  error: string | null;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create audio element
    const audioElement = new Audio();
    
    // Add error handling
    audioElement.addEventListener('error', (e) => {
      console.error("Audio error:", e);
      const errorMessage = e.target instanceof HTMLMediaElement 
        ? `Error code: ${e.target.error?.code}` 
        : 'Unknown audio error';
      setError(errorMessage);
    });
    
    // Set properties
    audioElement.loop = true;
    
    // Try multiple formats to increase browser compatibility
    const tryFormats = async () => {
      const formats = [
        '/music/background-song.mp3',
        '/music/background-song.ogg',
        '/music/background-song.wav'
      ];
      
      // Check if file exists before setting source
      for (const format of formats) {
        try {
          const response = await fetch(format, { method: 'HEAD' });
          if (response.ok) {
            audioElement.src = format;
            setAudio(audioElement);
            return;
          }
        } catch (err) {
          console.warn(`Format ${format} not available`);
        }
      }
      
      // If we get here, none of the formats worked
      setError('No supported audio format found. Please ensure the audio file exists in the public/music directory.');
    };
    
    tryFormats();

    // Clean up
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!audio || !userInteracted) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error("Error playing audio:", e);
          setError(`Failed to play audio: ${e.message}`);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, audio, userInteracted]);

  const toggleMusic = () => {
    setIsPlaying(prev => !prev);
    alert('called');
    if (!userInteracted) setUserInteracted(true);
  };

  const initializeMusic = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      setIsPlaying(true);
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic, initializeMusic, error }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};