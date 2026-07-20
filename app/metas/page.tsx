'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Target, Check, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/hooks/useGoals';
import { Goal, GoalType } from '@/types';

const goalTypes: { type: GoalType; label: string; emoji: string }[] = [
  { type: 'weekly_workouts', label: 'Treinos por semana', emoji: '📅' },
  { type: 'streak', label: 'Dias consecutivos', emoji: '🔥' },
  { type: 'total_workouts', label: 'Total de treinos', emoji: '🏋️' },
  { type: 'weight_loss', label: 'Perda de peso (kg)', emoji: '⚖️' },
  { type: 'muscle_gain', label: 'Ganho de massa', emoji: '💪' },
  { type: 'custom', label: 'Meta personalizada', emoji: '🎯' },
];

function GoalCard({ goal, onUpdate, onDelete }: { goal: Goal; onUpdate: (data: Partial<Goal>) => void; onDelete: () => void }) {
  const pct = Math.min((goal.current / goal.target) * 100, 100);
  const typeInfo = goalTypes.find((t) => t.type === goal.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card p-5"
      style={goal.completed ? { borderColor: 'rgba(34,197,94,0.3)' } : {}}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">{typeInfo?.emoji ?? '🎯'}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold" style={{ color: goal.completed ? '#22c55e' : 'var(--text-primary)' }}>
            {goal.title}
            {goal.completed && ' ✓'}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{goal.description}</p>
          {goal.deadline && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
        <button
          id={`btn-delete-goal-${goal.id}`}
          onClick={onDelete}
          className="shrink-0 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--text-secondary)' }}>Progresso</span>
          <span className="font-bold" style={{ color: pct >= 100 ? '#22c55e' : 'var(--brand)' }}>
            {goal.current} / {goal.target} {goal.unit}
          </span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={goal.completed ? { background: 'linear-gradient(90deg, #16a34a, #22c55e)' } : {}}
          />
        </div>
        <div className="text-xs text-right font-medium" style={{ color: pct >= 100 ? '#22c55e' : 'var(--text-muted)' }}>
          {pct.toFixed(0)}%{pct >= 100 && ' 🎉'}
        </div>
      </div>

      {/* Quick update */}
      {!goal.completed && (
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => onUpdate({ current: Math.max(0, goal.current - 1) })}
              className="w-7 h-7 rounded-lg border flex items-center justify-center text-sm font-bold transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >−</button>
            <span className="text-sm flex-1 text-center" style={{ color: 'var(--text-secondary)' }}>
              Atualizar progresso
            </span>
            <button
              id={`btn-increment-goal-${goal.id}`}
              onClick={() => onUpdate({ current: goal.current + 1, completed: goal.current + 1 >= goal.target })}
              className="w-7 h-7 rounded-lg brand-gradient text-white flex items-center justify-center text-sm font-bold"
            >+</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function AddGoalModal({ onAdd, onClose }: { onAdd: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => void; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<GoalType>('weekly_workouts');
  const [target, setTarget] = useState(5);
  const [unit, setUnit] = useState('treinos');
  const [desc, setDesc] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({ title, description: desc, type, target, current: 0, unit, completed: false });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="card p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Nova Meta</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Título</label>
            <input
              id="input-goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Treinar 5x por semana"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              {goalTypes.map((t) => (
                <button
                  key={t.type}
                  onClick={() => setType(t.type)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm text-left transition-all"
                  style={{
                    borderColor: type === t.type ? '#dc2626' : 'var(--border)',
                    background: type === t.type ? 'rgba(220,38,38,0.12)' : 'var(--bg-card-hover)',
                    color: type === t.type ? '#ef4444' : 'var(--text-secondary)',
                  }}
                >
                  <span>{t.emoji}</span>
                  <span className="text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Meta</label>
              <input
                id="input-goal-target"
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Unidade</label>
              <input
                id="input-goal-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="kg, treinos, dias..."
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Descrição (opcional)</label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Detalhes da meta..."
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          <motion.button
            id="btn-confirm-add-goal"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="w-full py-3 rounded-xl brand-gradient text-white font-bold"
          >
            Criar Meta
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MetasPage() {
  const { user } = useAuth();
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals(user?.id);
  const [showAdd, setShowAdd] = useState(false);

  const active = goals.filter((g) => !g.completed);
  const completed = goals.filter((g) => g.completed);

  return (
    <DashboardLayout>
      <AnimatePresence>
        {showAdd && <AddGoalModal onAdd={addGoal} onClose={() => setShowAdd(false)} />}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Minhas Metas</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {active.length} ativas · {completed.length} concluídas
            </p>
          </div>
          <motion.button
            id="btn-add-goal"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl brand-gradient text-white text-sm font-bold glow"
          >
            <Plus size={16} />
            Nova Meta
          </motion.button>
        </div>

        {/* ── Active Goals ───────────────────────────────────────────────── */}
        {active.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Em andamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {active.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onUpdate={(data) => updateGoal(goal.id, data)}
                    onDelete={() => deleteGoal(goal.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── Completed Goals ─────────────────────────────────────────────── */}
        {completed.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Concluídas 🎉</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completed.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdate={(data) => updateGoal(goal.id, data)}
                  onDelete={() => deleteGoal(goal.id)}
                />
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Nenhuma meta ainda</p>
            <p className="text-sm mt-2 mb-6" style={{ color: 'var(--text-muted)' }}>Crie sua primeira meta e comece a evoluir!</p>
            <button onClick={() => setShowAdd(true)} className="px-6 py-3 rounded-xl brand-gradient text-white font-bold">
              Criar Meta
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
