'use client';

import { useState, useEffect, useCallback } from 'react';
import { WorkoutSession, WorkoutExercise, UserStats } from '@/types';
import { format, subDays, isToday, parseISO } from 'date-fns';

const KEY = (uid: string) => `fitmaster_workouts_${uid}`;

function generateMockSessions(userId: string): WorkoutSession[] {
  const sessions: WorkoutSession[] = [];
  const workouts = [
    { category: 'Peito + Tríceps', exercises: ['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Tríceps Pulley', 'Tríceps Francês'] },
    { category: 'Costas + Bíceps', exercises: ['Barra Fixa', 'Remada Baixa', 'Puxada Frontal', 'Rosca Direta', 'Rosca Martelo'] },
    { category: 'Pernas', exercises: ['Agachamento', 'Leg Press', 'Cadeira Extensora', 'Mesa Flexora', 'Panturrilha'] },
    { category: 'Ombros + Abdômen', exercises: ['Desenvolvimento', 'Elevação Lateral', 'Crucifixo Inverso', 'Prancha', 'Abdominal Reto'] },
    { category: 'Braços', exercises: ['Rosca Direta', 'Rosca Martelo', 'Rosca Scott', 'Tríceps Pulley', 'Mergulho'] },
  ];

  for (let i = 0; i < 20; i++) {
    const daysAgo = i * 1 + Math.floor(Math.random() * 1);
    if (daysAgo === 0 && i > 0) continue;
    const w = workouts[i % workouts.length];
    const date = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');

    sessions.push({
      id: `session-${i}`,
      userId,
      date,
      category: w.category,
      exercises: w.exercises.map((name, j) => ({
        exerciseId: name.toLowerCase().replace(/ /g, '-'),
        name,
        sets: 3 + (j % 2),
        reps: 10 + j * 2,
        weight: 20 + j * 10,
        completed: true,
        completedAt: new Date().toISOString(),
      })),
      duration: 60 + Math.floor(Math.random() * 30),
      totalWeight: 2000 + Math.floor(Math.random() * 3000),
      createdAt: new Date().toISOString(),
    });
  }

  return sessions;
}

export function useWorkouts(userId: string | undefined) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const stored = localStorage.getItem(KEY(userId));
    if (stored) {
      setSessions(JSON.parse(stored));
    } else {
      const mock = generateMockSessions(userId);
      localStorage.setItem(KEY(userId), JSON.stringify(mock));
      setSessions(mock);
    }
    setLoading(false);
  }, [userId]);

  const save = (data: WorkoutSession[]) => {
    if (!userId) return;
    localStorage.setItem(KEY(userId), JSON.stringify(data));
    setSessions(data);
  };

  const addSession = useCallback((session: Omit<WorkoutSession, 'id' | 'createdAt'>) => {
    const newSession: WorkoutSession = {
      ...session,
      id: `session-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    save([newSession, ...sessions]);
    return newSession;
  }, [sessions, userId]);

  const updateSession = useCallback((id: string, data: Partial<WorkoutSession>) => {
    const updated = sessions.map((s) => s.id === id ? { ...s, ...data } : s);
    save(updated);
  }, [sessions, userId]);

  const markExerciseComplete = useCallback((sessionId: string, exerciseId: string) => {
    const updated = sessions.map((s) => {
      if (s.id !== sessionId) return s;
      return {
        ...s,
        exercises: s.exercises.map((e) =>
          e.exerciseId === exerciseId ? { ...e, completed: true, completedAt: new Date().toISOString() } : e
        ),
      };
    });
    save(updated);
  }, [sessions, userId]);

  const getTodaySession = (): WorkoutSession | null => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return sessions.find((s) => s.date === today) ?? null;
  };

  const getStats = (): UserStats => {
    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    const totalExercises = sessions.reduce((acc, s) => acc + s.exercises.filter((e) => e.completed).length, 0);
    const totalWeight = sessions.reduce((acc, s) => acc + s.totalWeight, 0);

    // Calculate streak
    let streak = 0;
    let d = new Date();
    while (true) {
      const dateStr = format(d, 'yyyy-MM-dd');
      if (sessions.find((s) => s.date === dateStr)) {
        streak++;
        d = subDays(d, 1);
      } else break;
    }

    // Weekly workouts
    const weekStart = subDays(new Date(), 7);
    const weeklyWorkouts = sessions.filter((s) => parseISO(s.date) >= weekStart).length;

    return {
      totalWorkouts: sessions.length,
      totalMinutes,
      totalExercises,
      currentStreak: streak,
      longestStreak: Math.max(streak, 7),
      totalWeight,
      weeklyWorkouts,
      activeDays: new Set(sessions.map((s) => s.date)).size,
    };
  };

  const getCalendarData = (): Record<string, boolean> => {
    const result: Record<string, boolean> = {};
    sessions.forEach((s) => { result[s.date] = true; });
    return result;
  };

  const getWeeklyProgress = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const result = days.map((day, i) => {
      const date = format(subDays(new Date(), (new Date().getDay() - i + 7) % 7), 'yyyy-MM-dd');
      const session = sessions.find((s) => s.date === date);
      return { day, trained: !!session, duration: session?.duration ?? 0 };
    });
    return result;
  };

  return {
    sessions,
    loading,
    addSession,
    updateSession,
    markExerciseComplete,
    getTodaySession,
    getStats,
    getCalendarData,
    getWeeklyProgress,
  };
}
