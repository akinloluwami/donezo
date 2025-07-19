import { create } from "zustand";
import { appClient } from "./app-client";

export type Label = {
  id: string;
  name: string;
  color?: string;
  userId?: string;
};

export type Extras = {
  id: string;
  labels: Label[];
  dueDate?: string; // ISO string
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  taskId: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  collectionId?: string;
  extras?: Extras;
  labels?: Label[];
  createdAt?: string;
  updatedAt?: string;
};

type TasksStore = {
  tasks: Task[];
  selectedTaskId: string | null;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  removeTask: (id: string) => void;
  loadTasks: (params?: any) => Promise<void>;
  setSelectedTaskId: (id: string | null) => void;
};

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  selectedTaskId: null,
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
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
}));
