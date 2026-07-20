'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { categories } from '@/data/exercises';
import { searchExercises } from '@/data/exercises';

export default function TreinosPage() {
  const [query, setQuery] = useState('');
  const results = query.trim() ? searchExercises(query) : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ── Search ───────────────────────────────────────────────────── */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            id="input-exercise-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar exercício..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* ── Search Results ───────────────────────────────────────────── */}
        {query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 space-y-2"
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              {results.length} resultado(s) para "{query}"
            </h3>
            {results.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
                Nenhum exercício encontrado
              </p>
            ) : (
              results.map((ex) => (
                <Link key={ex.id} href={`/treinos/${ex.muscleGroup}`}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{ background: 'var(--bg-card-hover)' }}
                  >
                    <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {ex.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{ex.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {ex.sets}x{ex.reps} · {ex.primaryMuscles[0]}
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </motion.div>
                </Link>
              ))
            )}
          </motion.div>
        )}

        {/* ── Categories ───────────────────────────────────────────────── */}
        {!query.trim() && (
          <>
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Grupos Musculares</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Escolha um grupo para ver os exercícios</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat, i) => (
                <Link key={cat.id} href={`/treinos/${cat.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="card p-6 cursor-pointer group relative overflow-hidden"
                  >
                    {/* Background glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `radial-gradient(ellipse at top left, ${cat.color}20 0%, transparent 70%)` }}
                    />

                    <div className="relative">
                      <div className="text-5xl mb-4">{cat.emoji}</div>
                      <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {cat.name}
                      </h3>
                      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                        {cat.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-semibold px-3 py-1 rounded-full"
                          style={{ background: 'rgba(220,38,38,0.12)', color: '#ef4444' }}
                        >
                          {cat.exerciseCount} exercícios
                        </span>
                        <motion.div
                          className="w-8 h-8 rounded-xl brand-gradient flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ChevronRight size={16} className="text-white" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
