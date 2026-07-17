// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  createdAt: string;
}

// ─── Exercises ───────────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'peito'
  | 'bracos'
  | 'pernas'
  | 'costas'
  | 'ombros'
  | 'abdomen';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
  weight: number; // kg
  restTime: number; // seconds
  description: string;
  tips: string[];
  primaryMuscles: string[];
  equipment: string;
}

// ─── Workout Session ─────────────────────────────────────────────────────────

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
  completedAt?: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string; // ISO date string YYYY-MM-DD
  category: string;
  exercises: WorkoutExercise[];
  duration: number; // minutes
  totalWeight: number; // kg
  notes?: string;
  createdAt: string;
}

// ─── Goals ───────────────────────────────────────────────────────────────────

export type GoalType =
  | 'weekly_workouts'
  | 'weight_loss'
  | 'muscle_gain'
  | 'streak'
  | 'total_workouts'
  | 'custom';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: GoalType;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  completed: boolean;
  createdAt: string;
}

// ─── Achievements ────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: {
    type: 'workouts' | 'streak' | 'weight' | 'exercises';
    value: number;
  };
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface UserStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalExercises: number;
  currentStreak: number;
  longestStreak: number;
  totalWeight: number; // total kg moved
  weeklyWorkouts: number;
  activeDays: number;
}

// ─── Progress Data ───────────────────────────────────────────────────────────

export interface ProgressEntry {
  date: string;
  weight?: number;
  muscleMass?: number;
  bodyFat?: number;
  workoutCount?: number;
  volume?: number; // total weight moved that week
}

// ─── Favorites ───────────────────────────────────────────────────────────────

export interface Favorite {
  exerciseId: string;
  addedAt: string;
}

// ─── Category Info ───────────────────────────────────────────────────────────

export interface CategoryInfo {
  id: MuscleGroup;
  name: string;
  emoji: string;
  color: string;
  exerciseCount: number;
  description: string;
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light';

// ─── Notification ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'workout' | 'achievement' | 'goal' | 'info';
  read: boolean;
  createdAt: string;
}
