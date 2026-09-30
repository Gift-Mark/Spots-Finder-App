import { createContext, useContext, useState, useRef } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null); // { id, title, src }
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(new Audio());

  const playTrack = (track) => {
    // If clicking the currently playing track, toggle play/pause
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // Load and play new track
    audioRef.current.pause();
    audioRef.current.src = track.audioUrl;
    audioRef.current.play();
    
    setCurrentTrack(track);
    setIsPlaying(true);

    audioRef.current.ontimeupdate = () => {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 1;
      setProgress((current / total) * 100);
    };

    audioRef.current.onended = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTrack(null);
    };
  };

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, progress, playTrack }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);