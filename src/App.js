import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const tracks = [
  {
    name: "Calm Night",
    artist: "Unknown Artist",
    image: "/Assets/photo1.png",
    path: "/Assets/calm-night.mp3",
  },
  {
    name: "Beatkitchen Bittersweet",
    artist: "Unknown Artist",
    image: "/Assets/photo2.png",
    path: "/Assets/beatkitchen-bittersweet.mp3",
  },
  {
    name: "Travel",
    artist: "Unknown Artist",
    image: "/Assets/photo3.png",
    path: "/Assets/travel.mp3",
  },
];

function App() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio(tracks[0].path));
  const intervalRef = useRef();

  const currentTrack = tracks[trackIndex];

  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(currentTrack.path);

    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current.duration);
    };

    audioRef.current.onended = handleNext;
    setCurrentTime(0);

    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    }

    return () => clearInterval(intervalRef.current);
  }, [trackIndex, currentTrack.path, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    }
  }, [isPlaying]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentTime(audioRef.current.currentTime);
    }, 1000);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleSeek = (e) => {
    const time = (e.target.value / 100) * duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="player">
      <div
        className="artwork"
        style={{ backgroundImage: `url(${currentTrack.image})` }}
      ></div>
      <div className="info">
        <h2>{currentTrack.name}</h2>
        <p>{currentTrack.artist}</p>
      </div>
      <div className="controls">
        <button onClick={handlePrev}>
          <i className="fas fa-backward"></i>
        </button>
        <button onClick={handlePlayPause}>
          <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
        </button>
        <button onClick={handleNext}>
          <i className="fas fa-forward"></i>
        </button>
      </div>
      <div className="progress">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          value={duration ? (currentTime / duration) * 100 : 0}
          onChange={handleSeek}
        />
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default App;
