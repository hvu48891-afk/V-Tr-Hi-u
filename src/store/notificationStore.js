import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  message: null,
  type: 'info',
  showNotification: (message, type = 'info') => {
    set({ message, type });
    setTimeout(() => {
      set({ message: null });
    }, 3000);
  },
  hideNotification: () => set({ message: null }),
}));
