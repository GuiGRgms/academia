'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkouts } from '@/hooks/useWorkouts';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import { format, subWeeks, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, TrendingDown } from 'lucide-react';

const weightData = [
  { week: 'Semana 1', peso: 85.2, massa: 68, gordura: 22 },
  { week: 'Semana 2', peso: 84.5, massa: 68.5, gordura: 21.5 },
  { week: 'Semana 3', peso: 83.8, massa: 69, gordura: 21 },
  { week: 'Semana 4', peso: 83.0, massa: 69.8, gordura: 20.5 },
  { week: 'Semana 5', peso: 82.5, massa: 70.2, gordura: 20 },
  { week: 'Semana 6', peso: 82.1, massa: 70.8, gordura: 19.5 },
  { week: 'Semana 7', peso: 81.8, massa: 71.2, gordura: 19 },
  { week: 'Semana 8', peso: 81.2, massa: 71.8, gordura: 18.5 },
];

const weeklyFreqData = [
  { day: 'Seg', treinos: 1, volume: 4200 },
  { day: 'Ter', treinos: 1, volume: 3800 },
  { day: 'Qua', treinos: 0, volume: 0 },
  { day: 'Qui', treinos: 1, volume: 5100 },
  { day: 'Sex', treinos: 1, volume: 4600 },
  { day: 'Sáb', treinos: 1, volume: 3200 },
  { day: 'Dom', treinos: 0, volume: 0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card p-3 text-sm shadow-lg" style={{ border: '1px solid var(--border)' }}>
        <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value}{p.name === 'Peso' || p.name === 'Massa' ? ' kg' : p.name === 'Gordura' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function EvolucaoPage() {
  const { user } = useAuth();
  const { sessions, getStats } = useWorkouts(user?.id);
  const stats = getStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Evolução</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Acompanhe sua transformação ao longo do tempo
          </p>
        </div>

        {/* ── Progress indicators ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Peso Atual', value: `${user?.weight ?? 82} kg`, trend: -3.2, trendLabel: 'vs. início', icon: '⚖️' },
            { label: 'Massa Muscular', value: '71.8 kg', trend: +3.8, trendLabel: 'ganho', icon: '💪' },
            { label: 'Gordura Corporal', value: '18.5%', trend: -3.5, trendLabel: 'redução', icon: '🔥' },
            { label: 'Freq. Semanal', value: `${stats.weeklyWorkouts}x`, trend: +2, trendLabel: 'vs. média', icon: '📅' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{item.icon}</span>
                <span
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={item.trend > 0
                    ? { background: 'rgba(34,197,94,0.12)', color: '#22c55e' }
                    : { background: 'rgba(220,38,38,0.12)', color: '#ef4444' }
                  }
                >
                  {item.trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {item.trend > 0 ? '+' : ''}{item.trend}
                </span>
              </div>
              <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.trendLabel}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Weight + Composition Chart ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Composição Corporal (8 semanas)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weightData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMassa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="peso" name="Peso" stroke="#dc2626" fill="url(#colorPeso)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="massa" name="Massa" stroke="#22c55e" fill="url(#colorMassa)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Weekly Volume ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Volume de Treino (semana atual)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyFreqData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="volume" name="Volume (kg)" fill="#dc2626" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Body fat trend ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Gordura Corporal (%)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weightData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="gordura" name="Gordura" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
