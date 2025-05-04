export interface VideoData {
  videoId: string;
  title: string;
}

export interface Assignment {
  type: 'physical' | 'psychological';
  behavior: string;
  description: string;
}

export interface Timestamp {
  videoId: string;
  assignmentId: string;
  time: number;
  userId?: string; // For future use with authentication
}

export interface VideoAssignment {
  video: VideoData;
  assignment: Assignment;
}

export interface VideoProgress {
  videoId: string;
  timestamps: Timestamp[];
  lastWatched: number; // timestamp
  totalTimeAnalyzed: number; // in seconds
}

export interface AssignmentProgress {
  assignmentId: string;
  videosAnalyzed: number;
  totalVideos: number;
  lastUpdated: number; // timestamp
  milestone: '10' | '25' | '50' | '75' | '100' | null;
}

export interface UserProgress {
  assignments: Record<string, AssignmentProgress>;
  videos: Record<string, VideoProgress>;
  lastUpdated: number;
} 