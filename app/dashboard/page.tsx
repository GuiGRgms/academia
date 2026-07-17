'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Dumbbell, Clock, Zap, Flame, TrendingUp, CheckCircle2, Play, Calendar, Target, Trophy,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkouts } from '@/hooks/useWorkouts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="card p-5 flex items-start gap-4"
    >
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const todayWorkout = {
  category: 'Peito + Tríceps',
  emoji: '🏋️',
  exercises: ['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Tríceps Pulley'],
  duration: '1h 15min',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { sessions, getTodaySession, getStats, getWeeklyProgress } = useWorkouts(user?.id);
  const stats = getStats();
  const weeklyProgress = getWeeklyProgress();
  const todaySession = getTodaySession();
  const today = new Date();

  const formatMinutes = (m: number) => {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return h > 0 ? `${h}h${min > 0 ? ` ${min}min` : ''}` : `${min}min`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ── Greeting ───────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
            Olá, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm mt-1 capitalize" style={{ color: 'var(--text-secondary)' }}>
            {format(today, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
        </motion.div>

        {/* ── Stats Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Dumbbell, label: 'Treinos Totais', value: stats.totalWorkouts, sub: 'sessões completas', color: 'brand-gradient' },
            { icon: Flame, label: 'Sequência Atual', value: `${stats.currentStreak} dias`, sub: 'consecutivos', color: 'bg-orange-500' },
            { icon: Clock, label: 'Tempo Total', value: formatMinutes(stats.totalMinutes), sub: 'treinando', color: 'bg-blue-600' },
            { icon: Zap, label: 'Semana Atual', value: `${stats.weeklyWorkouts}/5`, sub: 'treinos semanais', color: 'bg-purple-600' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}
              className="card p-5"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                  <s.icon size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.sub}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Treino do Dia ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div
              className="card p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, var(--bg-card) 100%)', borderColor: 'rgba(220,38,38,0.2)' }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #dc2626, transparent)', transform: 'translate(30%, -30%)' }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brand)' }}>
                      Treino do Dia
                    </span>
                    <h3 className="text-xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>
                      {todayWorkout.emoji} {todayWorkout.category}
                    </h3>
                  </div>
                  {todaySession ? (
                    <span className="flex items-center gap-1 text-sm font-semibold text-green-400">
                      <CheckCircle2 size={16} />
                      Concluído
                    </span>
                  ) : (
                    <Link href="/treinos">
                      <motion.button
                        id="btn-start-today-workout"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl brand-gradient text-white text-sm font-bold glow"
                      >
                        <Play size={14} fill="white" />
                        Iniciar
                      </motion.button>
                    </Link>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {todayWorkout.exercises.map((ex, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: todaySession ? '#22c55e' : 'var(--border)' }}>
                        {todaySession && <div className="w-2.5 h-2.5 rounded-full bg-green-400" />}
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{ex}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1"><Clock size={13} />{todayWorkout.duration}</span>
                  <span className="flex items-center gap-1"><Dumbbell size={13} />{todayWorkout.exercises.length} exercícios</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Progresso Semanal ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
              Progresso Semanal
            </h3>
            <div className="flex gap-2 justify-between">
              {weeklyProgress.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-8 h-20 rounded-lg flex items-end justify-center pb-2 relative overflow-hidden"
                    style={{ background: 'var(--bg-card-hover)' }}
                  >
                    {day.trained && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="absolute bottom-0 left-0 right-0 rounded-lg"
                        style={{ background: 'linear-gradient(0deg, #dc2626, #ef4444)' }}
                      />
                    )}
                    {weekDays[i] === weekDays[today.getDay()] && (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white z-10" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    {day.day[0]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-muted)' }}>Semana</span>
                <span className="font-bold brand-text">{stats.weeklyWorkouts}/5 treinos</span>
              </div>
              <div className="progress-bar mt-2">
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stats.weeklyWorkouts / 5) * 100, 100)}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Atividades Recentes ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Treinos Recentes</h3>
            <Link href="/historico" className="text-sm font-medium" style={{ color: 'var(--brand)' }}>
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {sessions.slice(0, 4).map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-4 p-3 rounded-xl transition-all"
                style={{ background: 'var(--bg-card-hover)' }}
              >
                <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white text-lg shrink-0">
                  {session.category.includes('Peito') ? '🏋️' :
                   session.category.includes('Costas') ? '🔥' :
                   session.category.includes('Pernas') ? '🦵' :
                   session.category.includes('Braços') ? '💪' : '🎯'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {session.category}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {session.exercises.length} exercícios · {session.duration}min
                  </div>
                </div>
                <div className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {format(new Date(session.date + 'T00:00:00'), "dd/MM", { locale: ptBR })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Quick Links ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/treinos', emoji: '💪', label: 'Ver Treinos' },
            { href: '/metas', emoji: '🎯', label: 'Minhas Metas' },
            { href: '/evolucao', emoji: '📈', label: 'Meu Progresso' },
            { href: '/conquistas', emoji: '🏆', label: 'Conquistas' },
          ].map((item, i) => (
            <Link key={i} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="card p-4 text-center cursor-pointer"
              >
                <div className="text-2xl mb-2">{item.emoji}</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
