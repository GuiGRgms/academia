'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, Clock, Dumbbell, Info, Heart, Star, Timer, X, ChevronRight, Play, Pause, RotateCcw,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getExercisesByCategory, categories } from '@/data/exercises';
import { Exercise, MuscleGroup } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// ── Rest Timer ─────────────────────────────────────────────────────────────
function RestTimer({ seconds, onClose }: { seconds: number; onClose: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [running, remaining]);

  const pct = ((seconds - remaining) / seconds) * 100;
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70"
    >
      <div className="card p-8 text-center max-w-sm w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>⏱ Descanso</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {/* Circle progress */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke="#dc2626" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-black" style={{ color: remaining <= 5 ? '#ef4444' : 'var(--text-primary)' }}>
              {m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${remaining}s`}
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setRunning(!running)}
            className="w-12 h-12 rounded-xl brand-gradient flex items-center justify-center text-white"
          >
            {running ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
          </button>
          <button
            onClick={() => setRemaining(seconds)}
            className="w-12 h-12 rounded-xl border flex items-center justify-center transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={onClose}
            className="px-4 h-12 rounded-xl border text-sm font-semibold"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Pular
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Exercise Modal ──────────────────────────────────────────────────────────
function ExerciseModal({
  exercise,
  onClose,
  onComplete,
  onTimer,
  completed,
}: {
  exercise: Exercise;
  onClose: () => void;
  onComplete: () => void;
  onTimer: () => void;
  completed: boolean;
}) {
  const [weight, setWeight] = useState(exercise.weight);
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="card w-full sm:max-w-lg rounded-b-none sm:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ borderColor: completed ? 'rgba(34,197,94,0.3)' : 'var(--border)' }}
      >
        {/* Header with gradient */}
        <div
          className="p-6 relative"
          style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.2) 0%, var(--bg-card) 100%)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>
                {exercise.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                {exercise.primaryMuscles.map((m, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(220,38,38,0.15)', color: '#ef4444' }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Visual placeholder with gradient */}
          <div
            className="w-full h-40 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.08), rgba(220,38,38,0.02))' }}
          >
            <div className="text-center">
              <div className="text-5xl mb-2">🏋️</div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{exercise.equipment}</p>
            </div>
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Séries', value: sets, setter: setSets, min: 1, max: 10 },
              { label: 'Reps', value: reps, setter: setReps, min: 1, max: 50 },
            ].map((param, i) => (
              <div key={i} className="card p-3 text-center">
                <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{param.label}</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => param.setter(Math.max(param.min, param.value - 1))}
                    className="w-6 h-6 rounded-lg brand-gradient text-white text-sm font-bold flex items-center justify-center"
                  >-</button>
                  <span className="text-lg font-black w-8 text-center" style={{ color: 'var(--text-primary)' }}>{param.value}</span>
                  <button
                    onClick={() => param.setter(Math.min(param.max, param.value + 1))}
                    className="w-6 h-6 rounded-lg brand-gradient text-white text-sm font-bold flex items-center justify-center"
                  >+</button>
                </div>
              </div>
            ))}
            <div className="card p-3 text-center">
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Peso (kg)</div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setWeight(Math.max(0, weight - 2.5))}
                  className="w-6 h-6 rounded-lg brand-gradient text-white text-sm font-bold flex items-center justify-center"
                >-</button>
                <span className="text-lg font-black w-10 text-center" style={{ color: 'var(--text-primary)' }}>{weight}</span>
                <button
                  onClick={() => setWeight(weight + 2.5)}
                  className="w-6 h-6 rounded-lg brand-gradient text-white text-sm font-bold flex items-center justify-center"
                >+</button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Como executar</h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{exercise.description}</p>
          </div>

          {/* Tips */}
          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>💡 Dicas</h4>
            <ul className="space-y-1">
              {exercise.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-red-500 mt-0.5 shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Rest time */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)' }}
          >
            <Clock size={16} className="text-red-400" />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Descanso recomendado: <strong className="text-red-400">{exercise.restTime}s</strong>
            </span>
            <button
              id="btn-start-rest-timer"
              onClick={onTimer}
              className="ml-auto text-xs px-3 py-1 rounded-lg brand-gradient text-white font-semibold"
            >
              Iniciar Timer
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <motion.button
              id="btn-mark-complete"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              style={completed ? {
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#22c55e',
              } : {
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: 'white',
              }}
            >
              <CheckCircle2 size={18} fill={completed ? '#22c55e' : 'none'} />
              {completed ? 'Concluído! ✓' : 'Marcar como Concluído'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const categoryId = params.categoria as MuscleGroup;

  const category = categories.find((c) => c.id === categoryId);
  const exercises = getExercisesByCategory(categoryId);

  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);
  const [timerExercise, setTimerExercise] = useState<Exercise | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`fitmaster_favorites_${user.id}`);
    if (stored) setFavorites(new Set(JSON.parse(stored)));
  }, [user]);

  const toggleFavorite = (id: string) => {
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavorites(next);
    if (user) localStorage.setItem(`fitmaster_favorites_${user.id}`, JSON.stringify([...next]));
  };

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!category) return <DashboardLayout><p>Categoria não encontrada.</p></DashboardLayout>;

  const progress = exercises.length > 0 ? (completed.size / exercises.length) * 100 : 0;

  return (
    <DashboardLayout>
      {/* ── Timers & Modals ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedEx && (
          <ExerciseModal
            key="modal"
            exercise={selectedEx}
            completed={completed.has(selectedEx.id)}
            onClose={() => setSelectedEx(null)}
            onComplete={() => { toggleComplete(selectedEx.id); }}
            onTimer={() => { setTimerExercise(selectedEx); }}
          />
        )}
        {timerExercise && (
          <RestTimer
            key="timer"
            seconds={timerExercise.restTime}
            onClose={() => setTimerExercise(null)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category.emoji}</span>
              <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{category.name}</h2>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{category.description}</p>
          </div>
        </div>

        {/* ── Progress bar ───────────────────────────────────────────────── */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Progresso da sessão
            </span>
            <span className="text-sm font-bold brand-text">{completed.size}/{exercises.length}</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-bar-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {progress === 100 && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-green-400 font-semibold mt-2 text-center"
            >
              🎉 Treino concluído! Excelente trabalho!
            </motion.p>
          )}
        </div>

        {/* ── Exercise Cards ─────────────────────────────────────────────── */}
        <div className="space-y-3">
          {exercises.map((ex, i) => {
            const done = completed.has(ex.id);
            const fav = favorites.has(ex.id);
            return (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card p-5 cursor-pointer"
                style={done ? { borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.04)' } : {}}
                onClick={() => setSelectedEx(ex)}
              >
                <div className="flex items-start gap-4">
                  {/* Check */}
                  <button
                    id={`btn-complete-${ex.id}`}
                    onClick={(e) => { e.stopPropagation(); toggleComplete(ex.id); }}
                    className="shrink-0 mt-0.5"
                  >
                    <motion.div
                      animate={{ scale: done ? [1, 1.3, 1] : 1 }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${done ? 'border-green-500 bg-green-500' : 'border-gray-600'}`}
                    >
                      {done && <CheckCircle2 size={14} className="text-white" fill="white" />}
                    </motion.div>
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold" style={{ color: done ? '#22c55e' : 'var(--text-primary)', textDecoration: done ? 'line-through' : 'none' }}>
                        {ex.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span>💪 {ex.sets} séries</span>
                      <span>🔄 {ex.reps} reps</span>
                      {ex.weight > 0 && <span>⚖️ {ex.weight}kg</span>}
                      <span>⏱ {ex.restTime}s</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id={`btn-fav-${ex.id}`}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(ex.id); }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                      style={{ color: fav ? '#ef4444' : 'var(--text-muted)' }}
                    >
                      <Star size={16} fill={fav ? '#ef4444' : 'none'} />
                    </button>
                    <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
