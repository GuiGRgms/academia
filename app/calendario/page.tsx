'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkouts } from '@/hooks/useWorkouts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { parseISO } from 'date-fns';

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function CalendarioPage() {
  const { user } = useAuth();
  const { sessions, getCalendarData } = useWorkouts(user?.id);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarData = getCalendarData();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();

  // Sessions for selected month
  const monthSessions = sessions.filter((s) => {
    const d = parseISO(s.date + 'T00:00:00');
    return d >= monthStart && d <= monthEnd;
  });

  const getStatus = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    if (calendarData[key]) return 'trained';
    if (isToday(date)) return 'today';
    if (date > new Date()) return 'future';
    return 'missed';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Calendário</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Acompanhe sua frequência de treinos
          </p>
        </div>

        {/* ── Month navigation ────────────────────────────────────────────── */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              id="btn-prev-month"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-lg font-black capitalize" style={{ color: 'var(--text-primary)' }}>
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h3>
            <button
              id="btn-next-month"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEK_DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: 'var(--text-muted)' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map((day, i) => {
              const status = getStatus(day);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className="aspect-square flex items-center justify-center rounded-xl text-sm font-semibold cursor-default relative"
                  style={{
                    background:
                      status === 'trained' ? 'rgba(34,197,94,0.2)' :
                      status === 'today' ? 'rgba(220,38,38,0.15)' :
                      status === 'missed' ? 'rgba(220,38,38,0.08)' :
                      'transparent',
                    color:
                      status === 'trained' ? '#22c55e' :
                      status === 'today' ? '#ef4444' :
                      status === 'missed' ? 'rgba(220,38,38,0.5)' :
                      'var(--text-muted)',
                    border:
                      status === 'today' ? '1px solid rgba(220,38,38,0.4)' :
                      status === 'trained' ? '1px solid rgba(34,197,94,0.3)' :
                      '1px solid transparent',
                  }}
                >
                  {format(day, 'd')}
                  {status === 'trained' && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-green-400" />
                  )}
                  {isToday(day) && (
                    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-green-500 opacity-70" />
              Treinei
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-500 opacity-40" />
              Sem treino
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm border border-red-500 opacity-70" />
              Hoje
            </div>
          </div>
        </div>

        {/* ── Month stats ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Treinos no mês', value: monthSessions.length },
            { label: 'Horas treinadas', value: `${Math.floor(monthSessions.reduce((a, s) => a + s.duration, 0) / 60)}h` },
            { label: 'Frequência', value: `${Math.round((monthSessions.length / days.length) * 100)}%` },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-4 text-center"
            >
              <div className="text-2xl font-black brand-text">{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── This month sessions ─────────────────────────────────────────── */}
        {monthSessions.length > 0 && (
          <div className="card p-5">
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Treinos de {format(currentMonth, 'MMMM', { locale: ptBR })}
            </h3>
            <div className="space-y-2">
              {monthSessions.slice(0, 6).map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {format(parseISO(s.date + 'T00:00:00'), 'dd')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.category}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.duration}min</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
