'use client';

import { memo } from 'react';
import { User } from '@/types';
import { useTheme } from '@/hooks/useTheme';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar = memo(function Navbar({ user, onLogout }: NavbarProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  return (
    <nav
      className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-md"
      role="navigation"
      aria-label="Navigazione principale"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" aria-label="Task Manager - Applicazione">
              Task Manager
            </h1>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="group relative p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 shadow-lg hover:shadow-xl hover:scale-110 transform"
                aria-label={`Cambia tema a ${theme === 'light' ? 'scuro' : 'chiaro'}`}
                title={`Tema ${theme === 'light' ? 'Chiaro' : 'Scuro'}`}
              >
                {theme === 'light' ? (
                  // Moon icon for dark mode
                  <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  // Sun icon for light mode
                  <svg className="w-5 h-5 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}

            {user && (
              <>
                {/* User Avatar and Name */}
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-white/70">Benvenuto</p>
                    <p
                      className="text-sm font-semibold text-white"
                      aria-label={`Utente corrente: ${user.username}`}
                    >
                      {user.username}
                    </p>
                  </div>
                </div>

                {/* Mobile User Initial */}
                <div className="sm:hidden w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center font-bold shadow-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="group relative px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-sm transition-all duration-300 border border-white/20 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 transform"
                  aria-label="Disconnetti dall'account"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </nav>
  );
});

export default Navbar;
