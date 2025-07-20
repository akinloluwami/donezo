import { create } from "zustand";
import { appClient } from "./app-client";
import { usersDB } from "./indexed-db";

export type User = {
  id: string;
  email: string;
  name?: string;
  hasCompletedOnboarding: boolean;
};

interface UserStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
    usersDB.add(user);
  },
  clearUser: () => {
    set({ user: null });
    localStorage.removeItem("user");
    appClient.auth.logout();
    const current = useUserStore.getState().user;
    if (current) usersDB.delete(current.id);
  },
  fetchUser: async () => {
    set({ loading: true });
    let localUser: User | null = null;
    try {
      const stored = localStorage.getItem("user");
      if (stored) localUser = JSON.parse(stored);
    } catch {}
    set({ user: localUser });
    if (localUser) usersDB.add(localUser);
    try {
      const backendUser = await appClient.auth.getCurrentUser();
      if (backendUser) {
        set({ user: backendUser });
        localStorage.setItem("user", JSON.stringify(backendUser));
        usersDB.add(backendUser);
      }
    } catch {}
    set(() => ({ loading: false }));
  },
}));

useUserStore.getState().fetchUser();
