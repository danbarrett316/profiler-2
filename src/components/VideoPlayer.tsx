import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { VideoAssignment, Timestamp } from '../types';
import '../styles/VideoPlayer.css';

interface VideoPlayerProps {
  videoAssignment: VideoAssignment;
  onTimestampRecorded: (timestamp: Timestamp) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoAssignment, onTimestampRecorded }) => {
  const [player, setPlayer] = useState<any>(null);

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  const handleBehaviorSpotted = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      const timestamp: Timestamp = {
        videoId: videoAssignment.video.videoId,
        assignmentId: videoAssignment.assignment.behavior,
        time: currentTime,
      };
      onTimestampRecorded(timestamp);
    }
  };

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <YouTube
          videoId={videoAssignment.video.videoId}
          onReady={onReady}
          opts={{
            height: '480',
            width: '854',
            playerVars: {
              autoplay: 0,
              controls: 1,
            },
          }}
        />
      </div>
      <div className="behavior-controls">
        <div className="assignment-info">
          <h3>Current Assignment</h3>
          <p>Type: {videoAssignment.assignment.type}</p>
          <p>Behavior: {videoAssignment.assignment.behavior}</p>
          <p>{videoAssignment.assignment.description}</p>
        </div>
        <button 
          className="behavior-button"
          onClick={handleBehaviorSpotted}
        >
          Record Behavior
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer; 