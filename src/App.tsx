import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './styles/VideoPlayer.css';
import './styles/ProgressTracker.css';
import './styles/ProgressBoard.css';
import VideoPlayer, { VideoPlayerHandle } from './components/VideoPlayer';
import ProgressBoard from './components/ProgressBoard';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { VideoAssignment, Timestamp } from './types';
import { videos, assignments } from './data/videoData';

type View = 'practice' | 'progress';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('practice');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(() => {
    const saved = localStorage.getItem('currentVideoIndex');
    return saved ? parseInt(saved) : 0;
  });
  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState(0);
  const { progress, updateVideoProgress, deleteVideoTimestamp } = useProgress();
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);

  const currentVideoAssignment: VideoAssignment = {
    video: videos[currentVideoIndex],
    assignment: assignments[currentAssignmentIndex]
  };

  useEffect(() => {
    localStorage.setItem('currentVideoIndex', currentVideoIndex.toString());
  }, [currentVideoIndex]);

  const handleTimestampRecorded = (timestamp: Timestamp) => {
    updateVideoProgress(
      timestamp.videoId,
      timestamp.assignmentId,
      timestamp.time,
      1 // This value is not used for display anymore
    );
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

  const handleRecordBehavior = () => {
    let currentTime = 0;
    if (videoPlayerRef.current) {
      currentTime = videoPlayerRef.current.getCurrentTime();
    }
    const timestamp: Timestamp = {
      videoId: videos[currentVideoIndex].videoId,
      assignmentId: assignments[currentAssignmentIndex].behavior,
      time: currentTime
    };
    handleTimestampRecorded(timestamp);
  };

  // Get timestamps for the current video from progress context
  const videoProgress = progress.videos[videos[currentVideoIndex].videoId];
  const filteredTimestamps = videoProgress?.timestamps || [];

  // Get current playback time for display
  const timeWatched = videoPlayerRef.current ? videoPlayerRef.current.getCurrentTime() : 0;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Behavioral Profiling Practice</h1>
        <nav className="main-nav">
          <button 
            className={`nav-button ${currentView === 'practice' ? 'active' : ''}`}
            onClick={() => setCurrentView('practice')}
          >
            Practice
          </button>
          <button 
            className={`nav-button ${currentView === 'progress' ? 'active' : ''}`}
            onClick={() => setCurrentView('progress')}
          >
            Progress Board
          </button>
        </nav>
      </header>
      <main>
        {currentView === 'practice' ? (
          <>
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
            <div className="main-content">
              <div className="video-panel">
                <VideoPlayer 
                  ref={videoPlayerRef}
                  videoAssignment={currentVideoAssignment}
                  onTimestampRecorded={handleTimestampRecorded}
                  hideAssignmentInfo={true}
                />
              </div>
              <div className="assignment-panel">
                <h2>Current Assignment</h2>
                <p><strong>Type:</strong> {currentVideoAssignment.assignment.type}</p>
                <p><strong>Behavior:</strong> {currentVideoAssignment.assignment.behavior}</p>
                <p>{currentVideoAssignment.assignment.description}</p>
                <p><strong>Time watched:</strong> {Math.floor(timeWatched)}s</p>
                <button className="behavior-button" onClick={handleRecordBehavior}>Record Behavior</button>
              </div>
            </div>
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
                      <button
                        className="delete-timestamp-button"
                        onClick={() => deleteVideoTimestamp(videos[currentVideoIndex].videoId, index)}
                        style={{ marginLeft: '8px', color: 'red', cursor: 'pointer' }}
                        aria-label="Delete timestamp"
                      >
                        ✕
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </>
        ) : (
          <ProgressBoard />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}

export default App; 