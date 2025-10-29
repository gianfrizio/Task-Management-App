'use client';

import { memo, useMemo } from 'react';
import { Task } from '@/types';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard = memo(function Dashboard({ tasks }: DashboardProps) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;

    const high = tasks.filter(t => t.priority === 'high').length;
    const medium = tasks.filter(t => t.priority === 'medium').length;
    const low = tasks.filter(t => t.priority === 'low').length;

    const overdue = tasks.filter(t => t.isOverdue).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueToday = tasks.filter(t => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      return due.getTime() === today.getTime() && t.status !== 'completed';
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Category stats
    const categoryCounts: { [key: string]: number } = {};
    tasks.forEach(t => {
      if (t.category) {
        categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
      }
    });
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Tag stats
    const tagCounts: { [key: string]: number } = {};
    tasks.forEach(t => {
      if (t.tags) {
        t.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Subtasks stats
    const totalSubtasks = tasks.reduce((sum, t) => sum + (t.subtasks?.length || 0), 0);
    const completedSubtasks = tasks.reduce((sum, t) => {
      return sum + (t.subtasks?.filter(st => st.completed).length || 0);
    }, 0);
    const subtaskCompletionRate = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      high,
      medium,
      low,
      overdue,
      dueToday,
      completionRate,
      topCategories,
      topTags,
      totalSubtasks,
      completedSubtasks,
      subtaskCompletionRate,
    };
  }, [tasks]);

  // Animated counter component
  const StatNumber = ({ value, delay = 0 }: { value: number; delay?: number }) => (
    <span className="inline-block animate-fadeIn" style={{ animationDelay: `${delay}ms` }}>
      {value}
    </span>
  );

  return (
    <div className="mb-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Panoramica completa dei tuoi task
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="group relative bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-white overflow-hidden card-hover">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wide">Task Totali</p>
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">
              <StatNumber value={stats.total} />
            </p>
            <p className="text-white/70 text-xs">Gestisci tutti i tuoi task</p>
          </div>
        </div>

        {/* Completed */}
        <div className="group relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-white overflow-hidden card-hover">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wide">Completati</p>
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">
              <StatNumber value={stats.completed} delay={100} />
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/30 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
              <span className="text-white/90 text-xs font-bold">{stats.completionRate}%</span>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="group relative bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-white overflow-hidden card-hover">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wide">In Corso</p>
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">
              <StatNumber value={stats.inProgress} delay={200} />
            </p>
            <p className="text-white/70 text-xs">Task attivi in lavorazione</p>
          </div>
        </div>

        {/* Overdue */}
        <div className="group relative bg-gradient-to-br from-pink-500 via-red-600 to-rose-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-white overflow-hidden card-hover">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          {stats.overdue > 0 && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
          )}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wide">In Ritardo</p>
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold mb-1">
              <StatNumber value={stats.overdue} delay={300} />
            </p>
            <p className="text-white/70 text-xs">Richiede attenzione immediata</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 card-hover">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-lg">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
              </div>
              Distribuzione Priorità
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full"></span>
                  Alta Priorità
                </span>
                <span className="text-gray-900 dark:text-white font-bold">{stats.high}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-400 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${stats.total > 0 ? (stats.high / stats.total) * 100 : 0}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></span>
                  Media Priorità
                </span>
                <span className="text-gray-900 dark:text-white font-bold">{stats.medium}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out delay-100"
                  style={{ width: `${stats.total > 0 ? (stats.medium / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></span>
                  Bassa Priorità
                </span>
                <span className="text-gray-900 dark:text-white font-bold">{stats.low}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out delay-200"
                  style={{ width: `${stats.total > 0 ? (stats.low / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 card-hover">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              Stato dei Task
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Da Fare
                </span>
                <span className="text-gray-900 dark:text-white font-bold">{stats.todo}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-gray-400 to-gray-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${stats.total > 0 ? (stats.todo / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  In Corso
                </span>
                <span className="text-gray-900 dark:text-white font-bold">{stats.inProgress}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out delay-100"
                  style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  Completati
                </span>
                <span className="text-gray-900 dark:text-white font-bold">{stats.completed}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-600 h-3 rounded-full transition-all duration-1000 ease-out delay-200"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg p-6 border-2 border-orange-200 dark:border-orange-900/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Avvisi Urgenti</h3>
          </div>
          <div className="space-y-3">
            {stats.dueToday > 0 && (
              <div className="bg-white dark:bg-gray-700 border-l-4 border-orange-500 p-4 rounded-lg shadow-sm animate-slideIn">
                <p className="text-sm font-bold text-orange-800 dark:text-orange-200 flex items-center gap-2">
                  <span className="text-xl">⏰</span>
                  Scadono oggi: {stats.dueToday}
                </p>
              </div>
            )}
            {stats.overdue > 0 && (
              <div className="bg-white dark:bg-gray-700 border-l-4 border-red-500 p-4 rounded-lg shadow-sm animate-slideIn">
                <p className="text-sm font-bold text-red-800 dark:text-red-200 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  In ritardo: {stats.overdue}
                </p>
              </div>
            )}
            {stats.dueToday === 0 && stats.overdue === 0 && (
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg text-center">
                <p className="text-4xl mb-2">🎉</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">Tutto sotto controllo!</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Categorie</h3>
          </div>
          <div className="space-y-3">
            {stats.topCategories.length > 0 ? (
              stats.topCategories.map(([category, count], index) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                  <span className="text-gray-800 dark:text-gray-200 font-medium truncate flex-1">{category}</span>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md ml-2">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Nessuna categoria ancora
              </p>
            )}
          </div>
        </div>

        {/* Top Tags */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Tags</h3>
          </div>
          <div className="space-y-3">
            {stats.topTags.length > 0 ? (
              stats.topTags.map(([tag, count], index) => (
                <div key={tag} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                  <span className="text-gray-800 dark:text-gray-200 font-medium truncate flex-1">#{tag}</span>
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md ml-2">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Nessun tag ancora
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Subtasks Progress */}
      {stats.totalSubtasks > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg p-6 border-2 border-green-200 dark:border-green-900/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Progresso Subtasks Globale</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex justify-between text-sm font-medium mb-3">
                <span className="text-gray-700 dark:text-gray-300">
                  {stats.completedSubtasks} di {stats.totalSubtasks} completati
                </span>
                <span className="text-green-700 dark:text-green-300 font-bold text-lg">
                  {stats.subtaskCompletionRate}%
                </span>
              </div>
              <div className="w-full bg-white dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${stats.subtaskCompletionRate}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="text-5xl">
              {stats.subtaskCompletionRate === 100 ? '🎯' : '📈'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Dashboard;
