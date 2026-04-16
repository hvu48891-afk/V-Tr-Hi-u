import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  setUser: (user) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('is_guest');
    set({ user: null });
  },
}));
