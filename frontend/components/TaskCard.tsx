'use client';

import { memo } from 'react';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const TaskCard = memo(function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const priorityConfig = {
    low: {
      gradient: 'from-green-400 to-emerald-500',
      badge: 'bg-gradient-to-r from-green-400 to-emerald-500',
      icon: '✓',
      label: 'Bassa'
    },
    medium: {
      gradient: 'from-amber-400 to-orange-500',
      badge: 'bg-gradient-to-r from-amber-400 to-orange-500',
      icon: '◐',
      label: 'Media'
    },
    high: {
      gradient: 'from-red-400 to-pink-500',
      badge: 'bg-gradient-to-r from-red-400 to-pink-500',
      icon: '⚡',
      label: 'Alta'
    },
  };

  const statusConfig = {
    'todo': {
      color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
      icon: '⭕',
      label: 'Da fare'
    },
    'in-progress': {
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
      icon: '⏳',
      label: 'In corso'
    },
    'completed': {
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
      icon: '✅',
      label: 'Completato'
    },
  };

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const hasSubtasks = totalSubtasks > 0;
  const progressPercentage = task.subtasksProgress?.percentage || 0;

  // Determine card border color based on priority
  const borderGradient = priorityConfig[task.priority].gradient;

  return (
    <article
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden card-hover animate-fadeIn group`}
      aria-label={`Task: ${task.title}`}
      role="article"
    >
      {/* Priority accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${borderGradient}`}></div>

      {/* Overdue badge */}
      {task.isOverdue && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
          ⚠️ Scaduto
        </div>
      )}

      <div className="p-6">
        {/* Header with title and priority */}
        <div className="flex justify-between items-start mb-4">
          <h3
            className="text-xl font-bold text-gray-900 dark:text-white flex-1 pr-4 leading-tight"
            id={`task-title-${task._id}`}
          >
            {task.title}
          </h3>
          <span
            className={`${priorityConfig[task.priority].badge} text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 shrink-0`}
            role="status"
            aria-label={`Priorità: ${priorityConfig[task.priority].label}`}
          >
            <span>{priorityConfig[task.priority].icon}</span>
            {priorityConfig[task.priority].label}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p
            className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3"
            id={`task-description-${task._id}`}
          >
            {task.description}
          </p>
        )}

        {/* Category */}
        {task.category && (
          <div className="mb-3">
            <span
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-200 text-xs font-medium px-3 py-1.5 rounded-lg"
              role="note"
              aria-label={`Categoria: ${task.category}`}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
              {task.category}
            </span>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Subtasks Progress */}
        {hasSubtasks && (
          <div className="mb-4 p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
            <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                Subtasks: {completedSubtasks}/{totalSubtasks}
              </span>
              <span className="font-bold">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-500 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div
            className={`flex items-center gap-2 text-sm mb-4 p-2 rounded-lg ${
              task.isOverdue
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-semibold'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            }`}
            aria-label={`Scadenza: ${new Date(task.dueDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}`}
          >
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
            <span>
              {new Date(task.dueDate).toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
              {task.isOverdue && ' • In ritardo'}
            </span>
          </div>
        )}

        {/* Status and Actions */}
        <div
          className="flex justify-between items-center pt-4 border-t-2 border-gray-100 dark:border-gray-700"
          role="group"
          aria-label="Azioni task"
        >
          <label htmlFor={`status-select-${task._id}`} className="sr-only">
            Cambia stato task
          </label>
          <select
            id={`status-select-${task._id}`}
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value as Task['status'])}
            className={`text-sm px-4 py-2 rounded-lg font-medium ${statusConfig[task.status].color} border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
            aria-label={`Stato corrente: ${statusConfig[task.status].label}`}
          >
            <option value="todo">{statusConfig['todo'].icon} Da fare</option>
            <option value="in-progress">{statusConfig['in-progress'].icon} In corso</option>
            <option value="completed">{statusConfig['completed'].icon} Completato</option>
          </select>

          <div className="flex gap-2" role="group" aria-label="Azioni modifica ed eliminazione">
            <button
              onClick={() => onEdit(task)}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
              aria-label={`Modifica task: ${task.title}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
              Modifica
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md"
              aria-label={`Elimina task: ${task.title}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              Elimina
            </button>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-br ${borderGradient} opacity-5`}></div>
      </div>
    </article>
  );
});

export default TaskCard;
