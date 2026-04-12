import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useTaskStore } from '../store/taskStore';

export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_at?: string;
}

export function useTasks() {
  const { 
    tasks, 
    loading, 
    error, 
    fetchTasks, 
    addTask, 
    updateTaskStatus, 
    deleteTask 
  } = useTaskStore();

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTaskStatus,
    deleteTask,
    refreshTasks: fetchTasks,
  };
}
