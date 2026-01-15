
import { Habit, HabitLog } from './types';

export const COLORS = {
  background: '#F9F9F8',
  obsidian: '#1A1A1A',
  charcoalBlue: '#2C3E50',
  forestGreen: '#10B981', // Emerald
  vibrantYellow: '#F59E0B', // Amber
  criticalRed: '#EF4444', // Red
  border: '#EAEAEA',
};

export const PROTOCOL_COLORS = [
  { name: 'Emerald', value: '#10B981' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Slate', value: '#475569' },
  { name: 'Teal', value: '#14B8A6' },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Deep Work',
    category: 'Productivity',
    frequency: 'daily',
    startDate: '2024-01-01',
    priority: 'high',
    isArchived: false,
    color: '#10B981',
    notes: 'Focus on core business tasks for 90 mins'
  },
  {
    id: '2',
    name: 'Zone 2 Cardio',
    category: 'Health',
    frequency: 'weekly',
    frequencyValue: 4,
    startDate: '2024-01-01',
    priority: 'medium',
    isArchived: false,
    color: '#F59E0B',
    notes: 'Keep heart rate between 130-145bpm'
  },
  {
    id: '3',
    name: 'Evening Reflection',
    category: 'Mental',
    frequency: 'daily',
    startDate: '2024-01-01',
    priority: 'low',
    isArchived: false,
    color: '#6366F1'
  }
];

const generateMockLogs = (habits: Habit[]): HabitLog[] => {
  const logs: HabitLog[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    habits.forEach(habit => {
      const chance = habit.priority === 'high' ? 0.8 : 0.6;
      if (Math.random() < chance) {
        logs.push({ habitId: habit.id, date: dateStr, completed: true });
      }
    });
  }
  return logs;
};

export const INITIAL_LOGS = generateMockLogs(INITIAL_HABITS);
