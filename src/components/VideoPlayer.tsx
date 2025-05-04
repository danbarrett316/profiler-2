import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import YouTube from 'react-youtube';
import { VideoAssignment, Timestamp } from '../types';
import { useProgress } from '../context/ProgressContext';
import '../styles/VideoPlayer.css';

export interface VideoPlayerHandle {
  getCurrentTime: () => number;
}

interface VideoPlayerProps {
  videoAssignment: VideoAssignment;
  onTimestampRecorded: (timestamp: Timestamp) => void;
  hideAssignmentInfo?: boolean;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ videoAssignment, onTimestampRecorded, hideAssignmentInfo }, ref) => {
    const [player, setPlayer] = useState<any>(null);
    const [totalWatchedTime, setTotalWatchedTime] = useState<number>(0);
    const { updateVideoProgress, updateAssignmentProgress } = useProgress();

    const onReady = (event: any) => {
      setPlayer(event.target);
    };

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => {
        if (player) {
          return player.getCurrentTime();
        }
        return 0;
      }
    }), [player]);

    const handleBehaviorSpotted = () => {
      if (player) {
        const currentTime = player.getCurrentTime();
        const timestamp: Timestamp = {
          videoId: videoAssignment.video.videoId,
          assignmentId: videoAssignment.assignment.behavior,
          time: currentTime,
        };
        onTimestampRecorded(timestamp);
        updateVideoProgress(
          videoAssignment.video.videoId,
          videoAssignment.assignment.behavior,
          currentTime,
          totalWatchedTime
        );
        updateAssignmentProgress(videoAssignment.assignment.behavior);
      }
    };

    useEffect(() => {
      let interval: NodeJS.Timeout | null = null;
      if (player) {
        interval = setInterval(() => {
          if (player.getPlayerState() === 1) { // Playing
            setTotalWatchedTime(player.getCurrentTime());
          }
        }, 1000);
      }
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [player]);

    useEffect(() => {
      // Reset watched time when video changes
      setTotalWatchedTime(0);
    }, [videoAssignment.video.videoId]);

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
        {!hideAssignmentInfo && (
          <div className="behavior-controls">
            <div className="assignment-info">
              <h3>Current Assignment</h3>
              <p>Type: {videoAssignment.assignment.type}</p>
              <p>Behavior: {videoAssignment.assignment.behavior}</p>
              <p>{videoAssignment.assignment.description}</p>
              <p>Time watched: {Math.floor(totalWatchedTime)}s</p>
            </div>
            <button 
              className="behavior-button"
              onClick={handleBehaviorSpotted}
            >
              Record Behavior
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default VideoPlayer; 