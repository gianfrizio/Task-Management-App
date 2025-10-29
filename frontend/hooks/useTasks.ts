import { useState, useEffect, useCallback, useMemo } from 'react';
import { tasksApi } from '@/lib/api';
import { Task, TaskFormData } from '@/types';
import toast from 'react-hot-toast';

interface TaskFilters {
  status: string;
  priority: string;
  search: string;
}

interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  createTask: (taskData: TaskFormData) => Promise<void>;
  updateTask: (taskId: string, taskData: TaskFormData) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
  refreshTasks: () => Promise<void>;
  clearFilters: () => void;
}

export function useTasks(isAuthenticated: boolean): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    search: '',
  });

  // Load tasks
  const loadTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await tasksApi.getTasks();
      setTasks(data);
    } catch (error: any) {
      console.error('Failed to load tasks:', error);
      toast.error('Impossibile caricare i task');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Create task
  const createTask = useCallback(async (taskData: TaskFormData) => {
    try {
      const newTask = await tasksApi.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      toast.success('Task creato con successo!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Impossibile creare il task';
      toast.error(message);
      throw error;
    }
  }, []);

  // Update task
  const updateTask = useCallback(async (taskId: string, taskData: TaskFormData) => {
    try {
      const updatedTask = await tasksApi.updateTask(taskId, taskData);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );
      toast.success('Task aggiornato!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Impossibile aggiornare il task';
      toast.error(message);
      throw error;
    }
  }, []);

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await tasksApi.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      toast.success('Task eliminato!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Impossibile eliminare il task';
      toast.error(message);
      throw error;
    }
  }, []);

  // Update task status
  const updateTaskStatus = useCallback(async (taskId: string, status: Task['status']) => {
    try {
      const updatedTask = await tasksApi.updateTask(taskId, { status });
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );
      toast.success('Stato aggiornato!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Impossibile aggiornare lo stato';
      toast.error(message);
      throw error;
    }
  }, []);

  // Filter tasks (memoized)
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
      const matchesSearch =
        filters.search === '' ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, filters]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      status: 'all',
      priority: 'all',
      search: '',
    });
  }, []);

  // Refresh tasks
  const refreshTasks = useCallback(async () => {
    await loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    filteredTasks,
    isLoading,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    refreshTasks,
    clearFilters,
  };
}
