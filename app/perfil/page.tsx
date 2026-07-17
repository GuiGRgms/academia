'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Settings, Save, Edit2, LogOut, Camera, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PerfilPage() {
  const { user, updateProfile, logout } = useAuth();
  const { getStats } = useWorkouts(user?.id);
  const stats = getStats();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    goal: user?.goal || '',
  });

  const imc = user?.weight && user?.height
    ? (user.weight / ((user.height / 100) ** 2)).toFixed(1)
    : '--';

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
      goal: formData.goal,
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Meu Perfil</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Gerencie suas informações e configurações
          </p>
        </div>

        {/* ── Main Profile Card ──────────────────────────────────────────── */}
        <div className="card p-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-24 brand-gradient opacity-20" />
          
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full brand-gradient flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-lg">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0]?.toUpperCase()
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:scale-110" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <Camera size={14} />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{user.name}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(220,38,38,0.1)', color: '#ef4444' }}>
                  {stats.currentStreak} dias de sequência 🔥
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                  {stats.totalWorkouts} treinos 🏋️
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: isEditing ? 'rgba(220,38,38,0.1)' : 'var(--bg-card-hover)', color: isEditing ? '#ef4444' : 'var(--text-primary)' }}
            >
              {isEditing ? <X size={16} /> : <Edit2 size={16} />}
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
          </div>
        </div>

        {/* ── Info Grid / Form ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div layout className="card p-6">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Settings size={18} className="text-red-500" /> Dados Pessoais
            </h4>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Nome Completo</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Idade</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Peso (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Altura (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Objetivo Principal</label>
                  <input
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg brand-gradient text-white font-bold shadow-md"
                >
                  <Save size={16} /> Salvar Alterações
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Idade</p>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user.age ?? '--'} anos</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Peso</p>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user.weight ?? '--'} kg</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Altura</p>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user.height ?? '--'} cm</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Objetivo</p>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user.goal ?? 'Não definido'}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Membro desde</p>
                  <p className="font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                    {format(new Date(user.createdAt), "MMM yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          <div className="space-y-6">
            <motion.div layout className="card p-6 flex flex-col justify-center items-center text-center">
              <div className="text-4xl font-black brand-text mb-1">{imc}</div>
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Índice de Massa Corporal</div>
              <p className="text-xs max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>
                {Number(imc) < 18.5 ? 'Abaixo do peso' : Number(imc) < 25 ? 'Peso normal' : Number(imc) < 30 ? 'Sobrepeso' : 'Obesidade'}
              </p>
            </motion.div>

            <motion.div layout className="card p-6">
              <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Conta</h4>
              <button
                onClick={logout}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all hover:bg-red-500/10 hover:border-red-500/30"
                style={{ borderColor: 'var(--border)', color: '#ef4444' }}
              >
                <span className="font-semibold">Sair da conta</span>
                <LogOut size={18} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
