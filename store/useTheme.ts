import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  theme:
    typeof window !== 'undefined' && localStorage.getItem('theme') === 'light'
      ? 'light'
      : 'dark',
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    }),
  setTheme: (t) => {
    localStorage.setItem('theme', t);
    set({ theme: t });
  },
}));