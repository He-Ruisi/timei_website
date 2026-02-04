export enum TrackerType {
  TIMER = 'TIMER',
  COUNTER = 'COUNTER',
  CHECKBOX = 'CHECKBOX',
  PROGRESS = 'PROGRESS'
}

export interface Goal {
  id: string;
  text: string;
  createdAt: number;
}

export interface Task {
  id: string;
  goalId: string;
  title: string;
  recommendedTracker: TrackerType;
  isInstantiated: boolean;
}

export interface Tracker {
  id: string;
  taskId: string; // Links back to the task
  title: string;
  type: TrackerType;
  // Timer specific
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number; // in seconds
  // Counter/Progress specific
  value: number;
  targetValue?: number;
  // Stats
  color: string;
}

export enum TimeBlockType {
  PLAN = 'PLAN',
  RECORD = 'RECORD'
}

export interface TimeBlock {
  id: string;
  trackerId: string;
  trackerTitle: string;
  type: TimeBlockType;
  startTime: number; // Timestamp
  endTime: number;   // Timestamp
  color: string;
}

export interface UserState {
  points: number;
  level: number;
}
