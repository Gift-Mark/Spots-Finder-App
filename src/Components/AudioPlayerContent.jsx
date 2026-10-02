import { useState } from 'react';
import { AudioContext } from './audioContext';

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (track) => {
    // Stop any speech if already speaking
    if ('speechSynthesis' in window) {
      if (currentTrack?.id === track.id && isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setCurrentTrack(null);
        return;
      }

      window.speechSynthesis.cancel(); // Stop current speech

      // Read out the landmark description
      const utterance = new SpeechSynthesisUtterance(
        `Welcome to ${track.title}. ${track.description || ''}`
      );
      
      utterance.rate = 0.95; // Speech speed
      utterance.pitch = 1;

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTrack(null);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentTrack(null);
      };

      setCurrentTrack(track);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, playTrack }}>
      {children}
    </AudioContext.Provider>
  );
};