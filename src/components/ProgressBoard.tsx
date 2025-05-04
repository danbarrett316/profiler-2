import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { Assignment } from '../types';
import { assignments } from '../data/videoData';
import '../styles/ProgressBoard.css';

const ProgressBoard: React.FC = () => {
  const { progress } = useProgress();

  // Group assignments by type
  const groupedAssignments = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.type]) {
      acc[assignment.type] = [];
    }
    acc[assignment.type].push(assignment);
    return acc;
  }, {} as Record<string, Assignment[]>);

  const getAssignmentStats = (assignmentId: string) => {
    const assignmentProgress = progress.assignments[assignmentId];
    const videoProgresses = Object.values(progress.videos).filter(video => 
      video.timestamps.some(t => t.assignmentId === assignmentId)
    );

    const totalTimeAnalyzed = videoProgresses.reduce((sum, video) => sum + video.totalTimeAnalyzed, 0);
    const behaviorCount = videoProgresses.reduce((sum, video) => 
      sum + video.timestamps.filter(t => t.assignmentId === assignmentId).length, 0
    );

    return {
      videosAnalyzed: assignmentProgress?.videosAnalyzed || 0,
      totalTimeAnalyzed: Math.floor(totalTimeAnalyzed / 60), // Convert to minutes
      behaviorCount,
      milestone: assignmentProgress?.milestone || null
    };
  };

  return (
    <div className="progress-board-list">
      <h1>Progress Overview</h1>
      {Object.entries(groupedAssignments).map(([type, typeAssignments]) => (
        <div key={type} className="assignment-group-list">
          <h2 className="group-title">{type.charAt(0).toUpperCase() + type.slice(1)} Behaviors</h2>
          <div className="assignments-list">
            {typeAssignments.map(assignment => {
              const stats = getAssignmentStats(assignment.behavior);
              const percent = Math.min((stats.videosAnalyzed / 100) * 100, 100);
              return (
                <div key={assignment.behavior} className="assignment-row">
                  <div className="assignment-info">
                    <div className="assignment-name">{assignment.behavior}</div>
                    <div className="assignment-stats">
                      <span className="stat">{stats.videosAnalyzed} / 100 videos</span>
                      <span className="stat">{stats.totalTimeAnalyzed} min</span>
                      <span className="stat">{stats.behaviorCount} recorded</span>
                    </div>
                  </div>
                  <div className="progress-bar-row">
                    <div className="progress-bar-horizontal">
                      <div 
                        className="progress-bar-horizontal-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    {stats.milestone && (
                      <span className="milestone-badge-list">{stats.milestone} Milestone</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBoard; 