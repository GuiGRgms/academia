'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useAchievements } from '@/hooks/useAchievements';
import { Lock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ConquistasPage() {
  const { user } = useAuth();
  const { getStats } = useWorkouts(user?.id);
  const stats = getStats();
  const achievements = useAchievements(
    user?.id,
    stats.totalWorkouts,
    stats.currentStreak,
    stats.totalExercises,
    stats.totalWeight,
  );

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Conquistas</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {unlocked.length} de {achievements.length} desbloqueadas
          </p>
        </div>

        {/* ── Progress bar ─────────────────────────────────────────────────── */}
        <div className="card p-4">
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: 'var(--text-secondary)' }}>Progresso geral</span>
            <span className="font-bold brand-text">{Math.round((unlocked.length / achievements.length) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* ── Unlocked ─────────────────────────────────────────────────────── */}
        {unlocked.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              🏆 Desbloqueadas ({unlocked.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unlocked.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="card p-4 text-center relative overflow-hidden cursor-default"
                  style={{ borderColor: 'rgba(220,38,38,0.3)' }}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at center, #dc2626, transparent)' }} />
                  <div className="relative">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                      className="text-4xl mb-2"
                    >
                      {achievement.icon}
                    </motion.div>
                    <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {achievement.title}
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {achievement.description}
                    </p>
                    {achievement.unlockedAt && (
                      <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                        {format(new Date(achievement.unlockedAt), "dd/MM/yy", { locale: ptBR })}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Locked ───────────────────────────────────────────────────────── */}
        {locked.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              🔒 Bloqueadas ({locked.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {locked.map((achievement, i) => {
                const pct = (() => {
                  const type = achievement.requirement.type;
                  const val = achievement.requirement.value;
                  if (type === 'workouts') return Math.min(stats.totalWorkouts / val, 1);
                  if (type === 'streak') return Math.min(stats.currentStreak / val, 1);
                  if (type === 'exercises') return Math.min(stats.totalExercises / val, 1);
                  if (type === 'weight') return Math.min(stats.totalWeight / val, 1);
                  return 0;
                })();

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="card p-4 text-center relative overflow-hidden"
                    style={{ opacity: 0.6 }}
                  >
                    <div className="text-4xl mb-2 grayscale opacity-40">{achievement.icon}</div>
                    <div className="absolute top-2 right-2">
                      <Lock size={12} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
                      {achievement.title}
                    </h4>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                      {achievement.description}
                    </p>
                    {/* Progress towards unlock */}
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${pct * 100}%` }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {Math.round(pct * 100)}%
                    </p>
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
