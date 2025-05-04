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