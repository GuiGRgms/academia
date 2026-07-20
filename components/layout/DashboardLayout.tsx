'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, LayoutDashboard, Calendar, BarChart2, Target, Trophy,
  History, User, Search, Bell, Sun, Moon, LogOut, Menu, X, Clock,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/treinos', icon: Dumbbell, label: 'Treinos' },
  { href: '/historico', icon: History, label: 'Histórico' },
  { href: '/evolucao', icon: BarChart2, label: 'Evolução' },
  { href: '/metas', icon: Target, label: 'Metas' },
  { href: '/calendario', icon: Calendar, label: 'Calendário' },
  { href: '/conquistas', icon: Trophy, label: 'Conquistas' },
  { href: '/perfil', icon: User, label: 'Perfil' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const currentPage = navItems.find((n) => n.href === pathname)?.label ?? 'Dashboard';

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Sidebar (desktop) ─────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-64 fixed top-0 left-0 bottom-0 border-r z-30"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center glow">
              <Dumbbell size={18} className="text-white" />
            </div>
            <span className="text-xl font-black brand-text">FitMaster</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative"
                    style={{
                      background: active ? 'rgba(220,38,38,0.12)' : 'transparent',
                      color: active ? '#ef4444' : 'var(--text-secondary)',
                    }}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: 'rgba(220,38,38,0.12)' }}
                      />
                    )}
                    <item.icon size={18} className="relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 relative z-10" />}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white text-sm font-bold overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.[0]?.toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</div>
              <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>
          <button
            id="btn-logout"
            onClick={() => { logout(); router.push('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
            style={{ color: 'var(--text-muted)' }}
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar ────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 border-r lg:hidden flex flex-col"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
            >
              <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center glow">
                    <Dumbbell size={18} className="text-white" />
                  </div>
                  <span className="text-xl font-black brand-text">FitMaster</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                        <div
                          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium"
                          style={{
                            background: active ? 'rgba(220,38,38,0.12)' : 'transparent',
                            color: active ? '#ef4444' : 'var(--text-secondary)',
                          }}
                        >
                          <item.icon size={18} />
                          {item.label}
                          {active && <ChevronRight size={14} className="ml-auto" />}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => { logout(); router.push('/'); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <LogOut size={16} />
                  Sair da conta
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 px-4 lg:px-6 py-4 border-b flex items-center gap-4"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <button
            id="btn-sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Menu size={22} />
          </button>

          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{currentPage}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link href="/perfil">
              <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white text-sm font-bold overflow-hidden cursor-pointer">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0]?.toUpperCase()
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* ── Mobile Bottom Nav ─────────────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t px-2 py-2"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
      >
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl"
                  style={{ color: active ? '#ef4444' : 'var(--text-muted)' }}
                >
                  <item.icon size={20} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
