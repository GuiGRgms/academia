'use client';

import { useState, useEffect } from 'react';
import { Achievement } from '@/types';

const KEY = (uid: string) => `fitmaster_achievements_${uid}`;

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-workout', title: 'Primeiro Passo', description: 'Complete seu primeiro treino', icon: '🏆', unlocked: false, requirement: { type: 'workouts', value: 1 } },
  { id: 'week-warrior', title: 'Guerreiro da Semana', description: 'Treine 5 vezes em uma semana', icon: '⚡', unlocked: false, requirement: { type: 'workouts', value: 5 } },
  { id: 'streak-7', title: '7 Dias Seguidos', description: 'Mantenha uma sequência de 7 dias', icon: '🔥', unlocked: false, requirement: { type: 'streak', value: 7 } },
  { id: 'streak-30', title: 'Mês de Ferro', description: '30 dias consecutivos de treino', icon: '💪', unlocked: false, requirement: { type: 'streak', value: 30 } },
  { id: 'workout-10', title: 'Em Forma', description: 'Complete 10 treinos', icon: '🎯', unlocked: false, requirement: { type: 'workouts', value: 10 } },
  { id: 'workout-50', title: 'Meio Centenário', description: 'Complete 50 treinos', icon: '🥈', unlocked: false, requirement: { type: 'workouts', value: 50 } },
  { id: 'workout-100', title: 'Centenário', description: 'Complete 100 treinos', icon: '🥇', unlocked: false, requirement: { type: 'workouts', value: 100 } },
  { id: 'exercises-100', title: 'Máquina', description: 'Realize 100 exercícios', icon: '🤖', unlocked: false, requirement: { type: 'exercises', value: 100 } },
  { id: 'exercises-500', title: 'Elite', description: 'Realize 500 exercícios', icon: '💎', unlocked: false, requirement: { type: 'exercises', value: 500 } },
  { id: 'weight-1000', title: 'Mil Kg Movidos', description: 'Mova 1.000 kg no total', icon: '🏋️', unlocked: false, requirement: { type: 'weight', value: 1000 } },
  { id: 'weight-10000', title: 'Dez Mil Kg', description: 'Mova 10.000 kg no total', icon: '🦍', unlocked: false, requirement: { type: 'weight', value: 10000 } },
  { id: 'streak-3', title: '3 Dias na Fila', description: 'Treine 3 dias seguidos', icon: '🔗', unlocked: false, requirement: { type: 'streak', value: 3 } },
];

export function useAchievements(
  userId: string | undefined,
  totalWorkouts: number,
  streak: number,
  totalExercises: number,
  totalWeight: number
) {
  const [achievements, setAchievements] = useState<Achievement[]>(ALL_ACHIEVEMENTS);

  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem(KEY(userId));
    const base = stored ? JSON.parse(stored) : ALL_ACHIEVEMENTS;

    // Unlock achievements based on stats
    const updated = base.map((a: Achievement) => {
      if (a.unlocked) return a;
      let shouldUnlock = false;
      if (a.requirement.type === 'workouts' && totalWorkouts >= a.requirement.value) shouldUnlock = true;
      if (a.requirement.type === 'streak' && streak >= a.requirement.value) shouldUnlock = true;
      if (a.requirement.type === 'exercises' && totalExercises >= a.requirement.value) shouldUnlock = true;
      if (a.requirement.type === 'weight' && totalWeight >= a.requirement.value) shouldUnlock = true;
      return shouldUnlock ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a;
    });

    localStorage.setItem(KEY(userId), JSON.stringify(updated));
    setAchievements(updated);
  }, [userId, totalWorkouts, streak, totalExercises, totalWeight]);

  return achievements;
}
