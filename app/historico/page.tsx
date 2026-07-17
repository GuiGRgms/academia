'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Dumbbell } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkouts } from '@/hooks/useWorkouts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const dayEmoji: Record<string, string> = {
  'segunda': '💪', 'terça': '🔥', 'quarta': '🦵',
  'quinta': '🎯', 'sexta': '🏋️', 'sábado': '⚡', 'domingo': '😴',
};

export default function HistoricoPage() {
  const { user } = useAuth();
  const { sessions, loading } = useWorkouts(user?.id);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    </DashboardLayout>
  );

  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Histórico de Treinos</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {sessions.length} treinos registrados
          </p>
        </div>

        {/* ── Summary cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: sessions.length, sub: 'treinos' },
            { label: 'Horas', value: Math.floor(sessions.reduce((a, s) => a + s.duration, 0) / 60), sub: 'treinando' },
            { label: 'Kg Movidos', value: `${(sessions.reduce((a, s) => a + s.totalWeight, 0) / 1000).toFixed(1)}t`, sub: 'no total' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-4 text-center"
            >
              <div className="text-2xl font-black brand-text">{s.value}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Timeline ────────────────────────────────────────────────────── */}
        {sorted.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
            <div className="text-5xl mb-4">🏋️</div>
            <p className="text-lg font-semibold">Nenhum treino ainda</p>
            <p className="text-sm mt-2">Complete seu primeiro treino para ver o histórico</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-5 top-0 bottom-0 w-0.5"
              style={{ background: 'var(--border)' }}
            />

            <div className="space-y-6">
              {sorted.map((session, i) => {
                const date = parseISO(session.date + 'T12:00:00');
                const dayName = format(date, 'EEEE', { locale: ptBR }).toLowerCase();
                const emoji = Object.entries(dayEmoji).find(([k]) => dayName.startsWith(k))?.[1] ?? '📅';

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-6"
                  >
                    {/* Dot */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center text-white text-lg z-10 relative glow">
                        {emoji}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 card p-5 mb-2">
                      {/* Date */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brand)' }}>
                            📅 {format(date, "EEEE", { locale: ptBR }).charAt(0).toUpperCase() + format(date, "EEEE", { locale: ptBR }).slice(1)}
                          </span>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {format(date, "dd 'de' MMMM", { locale: ptBR })}
                          </div>
                        </div>
                        <span
                          className="text-sm font-bold px-3 py-1 rounded-full"
                          style={{ background: 'rgba(220,38,38,0.12)', color: '#ef4444' }}
                        >
                          {session.category}
                        </span>
                      </div>

                      {/* Exercises */}
                      <div className="space-y-1.5 mb-4">
                        {session.exercises.map((ex, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-green-400 shrink-0" fill="#22c55e" />
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {ex.name}
                            </span>
                            <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                              {ex.sets}x{ex.reps}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer stats */}
                      <div
                        className="flex items-center gap-4 pt-3 border-t text-sm"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} />
                          {session.duration >= 60
                            ? `${Math.floor(session.duration / 60)}h${session.duration % 60 > 0 ? `${session.duration % 60}min` : ''}`
                            : `${session.duration}min`}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Dumbbell size={13} />
                          {(session.totalWeight / 1000).toFixed(1)} ton
                        </span>
                        <span className="ml-auto text-xs">{session.exercises.length} exercícios</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
