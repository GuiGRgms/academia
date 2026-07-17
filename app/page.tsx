'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Dumbbell, Zap, Target, Trophy, ChevronDown, Play, Star, Users, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function AnimatedCounter({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const observed = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        const start = Date.now();
        const timer = setInterval(() => {
          const elapsed = (Date.now() - start) / (duration * 1000);
          if (elapsed >= 1) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(end * elapsed));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString('pt-BR')}{suffix}</span>;
}

const features = [
  { icon: Dumbbell, title: 'Treinos Personalizados', desc: 'Planos de treino para cada grupo muscular com exercícios detalhados.', color: 'from-red-500/20 to-red-900/20' },
  { icon: TrendingUp, title: 'Progresso Visível', desc: 'Gráficos interativos do seu peso, massa muscular e frequência semanal.', color: 'from-orange-500/20 to-orange-900/20' },
  { icon: Target, title: 'Metas Inteligentes', desc: 'Defina e acompanhe suas metas com barras de progresso animadas.', color: 'from-red-500/20 to-pink-900/20' },
  { icon: Trophy, title: 'Conquistas e Badges', desc: 'Sistema gamificado de conquistas para manter você motivado.', color: 'from-yellow-500/20 to-yellow-900/20' },
  { icon: Zap, title: 'Cronômetro de Descanso', desc: 'Timer automático entre séries para otimizar seu descanso.', color: 'from-red-400/20 to-red-800/20' },
  { icon: Shield, title: 'Histórico Completo', desc: 'Timeline detalhada de todos os seus treinos em formato visual.', color: 'from-red-600/20 to-rose-900/20' },
];

const testimonials = [
  { name: 'Carlos Eduardo', role: 'Estudante de Educação Física', text: 'O FitMaster transformou minha rotina de treinos. Consegui ganhar 5kg de massa em 3 meses!', rating: 5 },
  { name: 'Ana Paula', role: 'Empresária', text: 'Finalmente um app que me mantém focada. As metas e conquistas me motivam todos os dias.', rating: 5 },
  { name: 'Rafael Silva', role: 'Personal Trainer', text: 'Uso e indico para todos os meus alunos. Interface incrível e funcionalidades completas.', rating: 5 },
];

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user]);

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center glow">
            <Dumbbell size={18} className="text-white" />
          </div>
          <span className="text-xl font-black brand-text">FitMaster</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button
            id="btn-login-nav"
            onClick={() => router.push('/login')}
            className="px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Entrar
          </button>
          <button
            id="btn-signup-nav"
            onClick={() => router.push('/login')}
            className="px-4 py-2 text-sm font-bold rounded-xl brand-gradient text-white glow transition-all duration-200 hover:opacity-90 active:scale-95"
          >
            Começar Grátis
          </button>
        </motion.div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background with parallax */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 50% -10%, rgba(220,38,38,0.2) 0%, transparent 70%),
                radial-gradient(ellipse 50% 40% at 80% 80%, rgba(185,28,28,0.1) 0%, transparent 60%),
                var(--bg-primary)
              `,
            }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(220,38,38,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.8) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </motion.div>

        <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
            style={{ borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.08)' }}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium" style={{ color: 'var(--brand)' }}>
              🔥 Mais de 10.000 treinos realizados
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6"
          >
            <span style={{ color: 'var(--text-primary)' }}>Supere Seus</span>
            <br />
            <span className="brand-text">Limites</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            O app fitness mais completo do Brasil. Acompanhe seus treinos, evolução e conquistas em um só lugar. Resultados reais, motivação constante.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              id="btn-start-workout"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="flex items-center gap-3 px-8 py-4 text-lg font-bold rounded-2xl brand-gradient text-white glow-lg"
            >
              <Dumbbell size={22} />
              Começar Treino
            </motion.button>
            <motion.button
              id="btn-watch-demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-2xl border transition-all"
              style={{ borderColor: 'var(--border-hover)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
            >
              <Play size={20} fill="currentColor" />
              Ver Demonstração
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Explorar</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 10000, label: 'Treinos Realizados', suffix: '+' },
              { value: 2500, label: 'Alunos Ativos', suffix: '+' },
              { value: 32, label: 'Exercícios Disponíveis', suffix: '' },
              { value: 98, label: 'Satisfação', suffix: '%' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-black brand-text mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Tudo que você precisa para
              <span className="brand-text"> evoluir</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }} className="text-lg max-w-2xl mx-auto">
              Funcionalidades premium para transformar sua rotina fitness
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="card p-6 group cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon size={22} className="text-red-400" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Muscle Groups Preview ────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              6 grupos musculares,
              <span className="brand-text"> 32 exercícios</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { emoji: '🏋️', name: 'Peito', count: 5 },
              { emoji: '💪', name: 'Braços', count: 6 },
              { emoji: '🦵', name: 'Pernas', count: 6 },
              { emoji: '🔥', name: 'Costas', count: 5 },
              { emoji: '🎯', name: 'Ombros', count: 5 },
              { emoji: '🧱', name: 'Abdômen', count: 5 },
            ].map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className="card p-6 flex items-center gap-4 cursor-pointer"
                onClick={() => router.push('/login')}
              >
                <span className="text-3xl">{g.emoji}</span>
                <div>
                  <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{g.name}</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{g.count} exercícios</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              O que nossos
              <span className="brand-text"> alunos</span> dizem
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="#dc2626" className="text-red-500" />
                  ))}
                </div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(10,10,10,1) 100%)', borderColor: 'rgba(220,38,38,0.2)' }}
          >
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at center, #dc2626 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                Pronto para transformar seu corpo?
              </h2>
              <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                Comece agora gratuitamente. Sem cartão de crédito.
              </p>
              <motion.button
                id="btn-start-final"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/login')}
                className="px-10 py-4 text-lg font-black rounded-2xl brand-gradient text-white glow-lg"
              >
                🔥 Começar Agora — É Grátis
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-8 px-6 text-center border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 brand-gradient rounded-lg flex items-center justify-center">
            <Dumbbell size={14} className="text-white" />
          </div>
          <span className="font-black brand-text">FitMaster</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          © 2024 FitMaster. Transformando vidas através do fitness.
        </p>
      </footer>
    </main>
  );
}
