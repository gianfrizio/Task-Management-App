export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Subtask {
  _id?: string;
  text: string;
  completed: boolean;
  createdAt?: string;
}

export interface SubtasksProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  subtasks?: Subtask[];
  subtasksProgress?: SubtasksProgress;
  dueDate?: string;
  isOverdue?: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  subtasks?: Subtask[];
  dueDate?: string;
}
