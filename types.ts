
export type Frequency = 'daily' | 'weekly' | 'custom';
export type Priority = 'low' | 'medium' | 'high';

export interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: Frequency;
  frequencyValue?: number;
  startDate: string;
  priority: Priority;
  notes?: string;
  isArchived: boolean;
  color?: string;
}

export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  requirement: string;
  unlocked: boolean;
  category: 'streak' | 'volume' | 'mastery';
}
