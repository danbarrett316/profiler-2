import React, { useEffect, useState } from 'react';
import { UserProgress, AssignmentProgress, VideoProgress, Timestamp } from '../types';

const STORAGE_KEY = 'behavioral-profiling-progress';

export const ProgressTracker: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      assignments: {},
      videos: {},
      lastUpdated: Date.now()
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateVideoProgress = (videoId: string, assignmentId: string, timestamp: number, totalTime: number) => {
    const newTimestamp: Timestamp = {
      videoId,
      assignmentId,
      time: timestamp
    };

    setProgress(prev => ({
      ...prev,
      videos: {
        ...prev.videos,
        [videoId]: {
          videoId,
          timestamps: [...(prev.videos[videoId]?.timestamps || []), newTimestamp],
          lastWatched: Date.now(),
          totalTimeAnalyzed: (prev.videos[videoId]?.totalTimeAnalyzed || 0) + totalTime
        }
      },
      lastUpdated: Date.now()
    }));
  };

  const updateAssignmentProgress = (assignmentId: string) => {
    const videosAnalyzed = Object.values(progress.videos).filter(v => 
      v.timestamps.some(t => t.assignmentId === assignmentId)
    ).length;

    const milestone = videosAnalyzed >= 100 ? '100' :
                     videosAnalyzed >= 75 ? '75' :
                     videosAnalyzed >= 50 ? '50' :
                     videosAnalyzed >= 25 ? '25' :
                     videosAnalyzed >= 10 ? '10' : null;

    setProgress(prev => ({
      ...prev,
      assignments: {
        ...prev.assignments,
        [assignmentId]: {
          assignmentId,
          videosAnalyzed,
          totalVideos: 100, // Assuming 100 is the target
          lastUpdated: Date.now(),
          milestone
        }
      },
      lastUpdated: Date.now()
    }));
  };

  const getMilestoneMessage = (assignmentId: string) => {
    const assignment = progress.assignments[assignmentId];
    if (!assignment || !assignment.milestone) return null;

    return `Congratulations! You've analyzed ${assignment.milestone} videos for this assignment!`;
  };

  return (
    <div className="progress-tracker">
      <h2>Progress Overview</h2>
      {Object.values(progress.assignments).map(assignment => (
        <div key={assignment.assignmentId} className="assignment-progress">
          <h3>Assignment {assignment.assignmentId}</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(assignment.videosAnalyzed / assignment.totalVideos) * 100}%` }}
            />
          </div>
          <p>{assignment.videosAnalyzed} / {assignment.totalVideos} videos analyzed</p>
          {getMilestoneMessage(assignment.assignmentId) && (
            <div className="milestone-message">
              {getMilestoneMessage(assignment.assignmentId)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 