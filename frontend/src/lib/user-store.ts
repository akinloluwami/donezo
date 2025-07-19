import { create } from "zustand";

export type User = {
  id: string;
  email: string;
  name?: string;
  hasCompletedOnboarding: boolean;
};

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

function getInitialUser(): User | null {
  try {
    const stored = localStorage.getItem("user");
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export const useUserStore = create<UserStore>((set) => ({
  user: getInitialUser(),
  setUser: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
  },
  clearUser: () => {
    set({ user: null });
    localStorage.removeItem("user");
  },
}));
