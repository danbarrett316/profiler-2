import React, { useState } from 'react';
import './App.css';
import './styles/VideoPlayer.css';
import VideoPlayer from './components/VideoPlayer';
import { VideoAssignment, Timestamp } from './types';
import { videos, assignments } from './data/videoData';

function App() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState(0);
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);

  const currentVideoAssignment: VideoAssignment = {
    video: videos[currentVideoIndex],
    assignment: assignments[currentAssignmentIndex]
  };

  const handleTimestampRecorded = (timestamp: Timestamp) => {
    setTimestamps(prev => [...prev, timestamp]);
    console.log('Recorded timestamp:', timestamp);
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePreviousVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleNextAssignment = () => {
    setCurrentAssignmentIndex((prev) => (prev + 1) % assignments.length);
  };

  const handlePreviousAssignment = () => {
    setCurrentAssignmentIndex((prev) => (prev - 1 + assignments.length) % assignments.length);
  };

  // Filter timestamps for the current video
  const filteredTimestamps = timestamps.filter(
    (stamp) => stamp.videoId === videos[currentVideoIndex].videoId
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Behavioral Profiling Practice</h1>
      </header>
      <main>
        <div className="controls">
          <div className="video-controls">
            <h2>Current Video</h2>
            <p>{videos[currentVideoIndex].title}</p>
            <div className="button-group">
              <button onClick={handlePreviousVideo}>Previous Video</button>
              <button onClick={handleNextVideo}>Next Video</button>
            </div>
          </div>
          <div className="assignment-controls">
            <h2>Current Assignment</h2>
            <p>{assignments[currentAssignmentIndex].behavior}</p>
            <div className="button-group">
              <button onClick={handlePreviousAssignment}>Previous Assignment</button>
              <button onClick={handleNextAssignment}>Next Assignment</button>
            </div>
          </div>
        </div>
        <VideoPlayer 
          videoAssignment={currentVideoAssignment}
          onTimestampRecorded={handleTimestampRecorded}
        />
        <div className="timestamps-section">
          <h2>Recorded Timestamps</h2>
          <ul className="timestamp-list">
            {filteredTimestamps.length === 0 ? (
              <li className="timestamp-empty">No timestamps recorded for this video yet.</li>
            ) : (
              filteredTimestamps.map((stamp, index) => (
                <li key={index} className="timestamp-item">
                  <span className="timestamp-behavior">{assignments.find(a => a.behavior === stamp.assignmentId)?.behavior}</span>
                  <span className="timestamp-time">at {Math.floor(stamp.time)}s</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App; 