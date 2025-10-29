'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Task, TaskFormData } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useDebounce } from '@/hooks/useDebounce';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useTaskNotifications } from '@/hooks/useTaskNotifications';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import toast from 'react-hot-toast';

export default function Home() {
  // Custom hooks
  const { user, isLoading: isAuthLoading, login, register, logout } = useAuth();
  const {
    tasks,
    filteredTasks,
    isLoading: isTasksLoading,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    clearFilters,
  } = useTasks(!!user);

  // Task notifications
  useTaskNotifications(tasks, !!user);

  // Local UI state
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [showDashboard, setShowDashboard] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Refs for keyboard navigation
  const searchInputRef = useRef<HTMLInputElement>(null);
  const newTaskButtonRef = useRef<HTMLButtonElement>(null);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch, setFilters]);

  // Keyboard navigation: Escape to close form
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showForm) {
        setShowForm(false);
        setEditingTask(undefined);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showForm]);

  // Keyboard shortcuts (only when user is logged in)
  useKeyboardShortcut(
    [
      {
        key: 'k',
        ctrl: true,
        callback: () => searchInputRef.current?.focus(),
        description: 'Focus search',
      },
      {
        key: 'n',
        ctrl: true,
        callback: () => {
          if (!showForm) {
            setEditingTask(undefined);
            setShowForm(true);
          }
        },
        description: 'New task',
      },
      {
        key: '/',
        callback: () => searchInputRef.current?.focus(),
        description: 'Focus search (quick)',
      },
    ],
    !!user
  );

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(authForm.email, authForm.password);
      } else {
        await register(authForm.username, authForm.email, authForm.password);
      }
      setAuthForm({ username: '', email: '', password: '' });
    } catch (error) {
      // Error is already handled in the hook with toast
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      setShowForm(false);
      setEditingTask(undefined);
    } catch (error) {
      // Error is already handled in the hook with toast
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo task?')) {
      await deleteTask(id);
    }
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    await updateTaskStatus(id, status);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSelectedTags([]);
    clearFilters();
  };

  // Export/Import functions
  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Task esportati con successo!');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (!Array.isArray(imported)) {
          throw new Error('File non valido');
        }

        // Import each task
        let successCount = 0;
        for (const taskData of imported) {
          try {
            await createTask({
              title: taskData.title,
              description: taskData.description,
              status: taskData.status,
              priority: taskData.priority,
              category: taskData.category,
              tags: taskData.tags,
              subtasks: taskData.subtasks,
              dueDate: taskData.dueDate,
            });
            successCount++;
          } catch (error) {
            console.error('Errore importando task:', taskData.title, error);
          }
        }

        toast.success(`${successCount} task importati con successo!`);
      } catch (error) {
        toast.error('Errore durante l\'importazione');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  // Get all unique tags from tasks
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
      task.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  // Filter tasks by selected tags
  const finalFilteredTasks = useMemo(() => {
    if (selectedTags.length === 0) return filteredTasks;
    return filteredTasks.filter(task =>
      selectedTags.every(tag => task.tags?.includes(tag))
    );
  }, [filteredTasks, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Initial loading spinner
  if (isAuthLoading && !user) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-white/20 border-t-white mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-white text-lg font-medium">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
        <div className="glass backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white/20 rounded-2xl mb-4 shimmer">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Task Manager
            </h1>
            <p className="text-white/80 text-sm">Organizza la tua produttività</p>
          </div>

          <div className="flex gap-2 mb-6 bg-white/10 p-1 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              disabled={isAuthLoading}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                isLogin
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              } disabled:opacity-50`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              disabled={isAuthLoading}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                !isLogin
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              } disabled:opacity-50`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="animate-slideIn">
                <label className="block text-sm font-medium text-white mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all backdrop-blur-sm"
                  placeholder="Il tuo username"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all backdrop-blur-sm"
                placeholder="tua@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all backdrop-blur-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              {isAuthLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-2"></div>
                  {isLogin ? 'Login in corso...' : 'Registrazione...'}
                </>
              ) : (
                <>{isLogin ? '🚀 Accedi' : '✨ Registrati'}</>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-all duration-500">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8" role="main" aria-label="Gestione tasks">
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white" id="tasks-heading">
            I Miei Task
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {showDashboard ? '📊 Nascondi Dashboard' : '📊 Mostra Dashboard'}
            </button>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              💾 Esporta JSON
            </button>
            <label className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-indigo-500">
              📥 Importa JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              ref={newTaskButtonRef}
              onClick={() => {
                setEditingTask(undefined);
                setShowForm(!showForm);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={showForm ? 'Annulla creazione task' : 'Crea nuovo task'}
              aria-expanded={showForm}
              aria-controls="task-form-container"
              title="Scorciatoia: Ctrl+N"
            >
              {showForm ? 'Annulla' : 'Nuovo Task'}
            </button>
          </div>
        </div>

        {/* Dashboard */}
        {showDashboard && <Dashboard tasks={tasks} />}

        {showForm && (
          <div className="mb-6" id="task-form-container" role="region" aria-labelledby="form-title">
            <TaskForm
              task={editingTask}
              onSubmit={handleCreateTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(undefined);
              }}
            />
          </div>
        )}

        <section
          className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
          aria-labelledby="filters-heading"
          role="search"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white" id="filters-heading">
            Filtri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <label htmlFor="search-input" className="sr-only">Cerca nei task</label>
            <input
              ref={searchInputRef}
              id="search-input"
              type="search"
              placeholder="Cerca... (Ctrl+K o /)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Cerca nei titoli e descrizioni dei task. Scorciatoie: Ctrl+K oppure /"
              title="Scorciatoia: Ctrl+K o /"
            />
            <label htmlFor="status-filter" className="sr-only">Filtra per stato</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filtra i task per stato"
            >
              <option value="all">Tutti gli stati</option>
              <option value="todo">Da fare</option>
              <option value="in-progress">In corso</option>
              <option value="completed">Completato</option>
            </select>
            <label htmlFor="priority-filter" className="sr-only">Filtra per priorità</label>
            <select
              id="priority-filter"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filtra i task per priorità"
            >
              <option value="all">Tutte le priorità</option>
              <option value="low">Bassa</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
            <button
              onClick={handleClearFilters}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Rimuovi tutti i filtri"
            >
              Pulisci filtri
            </button>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🏷️ Filtra per Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selezionat{selectedTags.length > 1 ? 'i' : 'o'}
                </p>
              )}
            </div>
          )}
        </section>

        {isTasksLoading ? (
          <div
            className="flex justify-center items-center py-12"
            role="status"
            aria-live="polite"
            aria-label="Caricamento tasks in corso"
          >
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
                aria-hidden="true"
              ></div>
              <p className="text-gray-600 dark:text-gray-400">Caricamento task...</p>
            </div>
          </div>
        ) : finalFilteredTasks.length === 0 ? (
          <div
            className="text-center py-12 text-gray-500 dark:text-gray-400"
            role="status"
            aria-live="polite"
          >
            {filters.status !== 'all' || filters.priority !== 'all' || filters.search || selectedTags.length > 0 ? (
              <>
                <p className="mb-2">Nessun task trovato con questi filtri.</p>
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  aria-label="Rimuovi tutti i filtri applicati"
                >
                  Rimuovi filtri
                </button>
              </>
            ) : (
              <p>Nessun task trovato. Crea il tuo primo task per iniziare!</p>
            )}
          </div>
        ) : (
          <section
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-labelledby="tasks-heading"
            aria-live="polite"
            aria-atomic="false"
          >
            {finalFilteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
