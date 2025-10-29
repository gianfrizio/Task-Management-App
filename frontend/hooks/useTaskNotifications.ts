import { useEffect, useRef } from 'react';
import { Task } from '@/types';
import toast from 'react-hot-toast';

export function useTaskNotifications(tasks: Task[], isAuthenticated: boolean) {
  const hasShownNotification = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated || tasks.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
      // Skip completed tasks
      if (task.status === 'completed') return;

      // Skip if already shown notification for this task
      if (hasShownNotification.current.has(task._id)) return;

      // Check if task is overdue
      if (task.isOverdue) {
        toast.error(
          `⚠️ Task in ritardo: "${task.title}"`,
          {
            duration: 6000,
            id: `overdue-${task._id}`,
          }
        );
        hasShownNotification.current.add(task._id);
        return;
      }

      // Check if task is due today
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate.getTime() === today.getTime()) {
          toast(
            `📅 Scade oggi: "${task.title}"`,
            {
              icon: '⏰',
              duration: 5000,
              id: `due-today-${task._id}`,
            }
          );
          hasShownNotification.current.add(task._id);
        }
      }
    });
  }, [tasks, isAuthenticated]);

  // Reset notification tracking when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      hasShownNotification.current.clear();
    }
  }, [isAuthenticated]);
}
