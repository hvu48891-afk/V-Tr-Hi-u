import { create } from 'zustand';

interface NotificationStore {
  message: string | null;
  type: 'success' | 'error' | 'info';
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
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
