import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { Task, TaskStatus, TaskPriority } from '../hooks/useTasks';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<Task | undefined>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: true,
  error: null,

  setTasks: (tasks) => set({ tasks }),

  fetchTasks: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tasks: data || [], error: null });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (task) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select();

      if (error) throw error;
      if (data) {
        set((state) => ({ tasks: [data[0], ...state.tasks] }));
      }
      return data?.[0];
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  updateTaskStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteTask: async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
}));
