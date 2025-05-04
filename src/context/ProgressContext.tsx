import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress, VideoProgress, AssignmentProgress } from '../types';

interface ProgressContextType {
  progress: UserProgress;
  updateVideoProgress: (videoId: string, assignmentId: string, timestamp: number, totalTime: number) => void;
  updateAssignmentProgress: (assignmentId: string) => void;
  deleteVideoTimestamp: (videoId: string, timestampIndex: number) => void;
}

const STORAGE_KEY = 'behavioral-profiling-progress';

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    setProgress(prev => ({
      ...prev,
      videos: {
        ...prev.videos,
        [videoId]: {
          videoId,
          timestamps: [...(prev.videos[videoId]?.timestamps || []), { videoId, assignmentId, time: timestamp }],
          lastWatched: Date.now(),
          totalTimeAnalyzed: (prev.videos[videoId]?.totalTimeAnalyzed || 0) + totalTime
        }
      },
      lastUpdated: Date.now()
    }));
  };

  const deleteVideoTimestamp = (videoId: string, timestampIndex: number) => {
    setProgress(prev => {
      const video = prev.videos[videoId];
      if (!video) return prev;
      const newTimestamps = video.timestamps.filter((_, idx) => idx !== timestampIndex);
      return {
        ...prev,
        videos: {
          ...prev.videos,
          [videoId]: {
            ...video,
            timestamps: newTimestamps
          }
        },
        lastUpdated: Date.now()
      };
    });
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

  return (
    <ProgressContext.Provider value={{ progress, updateVideoProgress, updateAssignmentProgress, deleteVideoTimestamp }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}; 