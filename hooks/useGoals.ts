'use client';

import { useState, useEffect, useCallback } from 'react';
import { Goal, GoalType } from '@/types';

const KEY = (uid: string) => `fitmaster_goals_${uid}`;

const DEFAULT_GOALS: Omit<Goal, 'id' | 'userId' | 'createdAt'>[] = [
  { title: 'Treinar 5x por semana', description: 'Manter consistência semanal', type: 'weekly_workouts', target: 5, current: 3, unit: 'treinos', completed: false },
  { title: 'Perder 8 kg', description: 'Meta de emagrecimento', type: 'weight_loss', target: 8, current: 2.5, unit: 'kg', deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), completed: false },
  { title: '30 dias consecutivos', description: 'Sequência de treinos', type: 'streak', target: 30, current: 12, unit: 'dias', completed: false },
  { title: '100 treinos completados', description: 'Marco de consistência', type: 'total_workouts', target: 100, current: 47, unit: 'treinos', completed: false },
];

export function useGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem(KEY(userId));
    if (stored) {
      setGoals(JSON.parse(stored));
    } else {
      const initial: Goal[] = DEFAULT_GOALS.map((g, i) => ({
        ...g,
        id: `goal-${i}`,
        userId,
        createdAt: new Date().toISOString(),
      }));
      localStorage.setItem(KEY(userId), JSON.stringify(initial));
      setGoals(initial);
    }
  }, [userId]);

  const save = (data: Goal[]) => {
    if (!userId) return;
    localStorage.setItem(KEY(userId), JSON.stringify(data));
    setGoals(data);
  };

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => {
    const newGoal: Goal = { ...goal, id: `goal-${Date.now()}`, userId: userId!, createdAt: new Date().toISOString() };
    save([...goals, newGoal]);
  }, [goals, userId]);

  const updateGoal = useCallback((id: string, data: Partial<Goal>) => {
    save(goals.map((g) => g.id === id ? { ...g, ...data } : g));
  }, [goals, userId]);

  const deleteGoal = useCallback((id: string) => {
    save(goals.filter((g) => g.id !== id));
  }, [goals, userId]);

  const completeGoal = useCallback((id: string) => {
    save(goals.map((g) => g.id === id ? { ...g, completed: true } : g));
  }, [goals, userId]);

  return { goals, addGoal, updateGoal, deleteGoal, completeGoal };
}
