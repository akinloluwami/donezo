import { create } from "zustand";
import { appClient } from "./app-client";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  collectionId?: string;
  extras?: any;
  labels?: any[];
  createdAt?: string;
  updatedAt?: string;
};

type TasksStore = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  removeTask: (id: string) => void;
  loadTasks: (params?: any) => Promise<void>;
};

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  loadTasks: async (params) => {
    const tasks = await appClient.tasks.getTasks(params);
    set({ tasks });
  },
}));
