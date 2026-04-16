import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isAddingTask: null,
  setIsAddingTask: (status) => set({ isAddingTask: status }),
  isGlobalAddingTask: false,
  setIsGlobalAddingTask: (isOpen) => set({ isGlobalAddingTask: isOpen }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  currentView: 'My Tasks',
  setCurrentView: (view) => set({ currentView: view }),
}));
