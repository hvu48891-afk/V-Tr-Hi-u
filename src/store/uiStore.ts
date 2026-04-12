import { create } from 'zustand';
import { TaskStatus } from '../hooks/useTasks';

export type ViewType = 'My Tasks' | 'Dashboard' | 'Team' | 'Analytics' | 'Archive' | 'Settings';

interface UIStore {
  isAddingTask: TaskStatus | null;
  setIsAddingTask: (status: TaskStatus | null) => void;
  isGlobalAddingTask: boolean;
  setIsGlobalAddingTask: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isAddingTask: null,
  setIsAddingTask: (status) => set({ isAddingTask: status }),
  isGlobalAddingTask: false,
  setIsGlobalAddingTask: (isOpen) => set({ isGlobalAddingTask: isOpen }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  currentView: 'My Tasks',
  setCurrentView: (view) => set({ currentView: view }),
}));
