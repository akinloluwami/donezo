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
  dueDate?: string;
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
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  updateTaskOptimistically: (id: string, data: Partial<Task>) => void;
  removeTask: (id: string) => void;
  loadTasks: (params?: any) => Promise<void>;
  setSelectedTaskId: (id: string | null) => void;
  deleteTask: (id: string) => Promise<void>;
};

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  selectedTaskId: null,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTaskOptimistically: (id, data) => {
    const allowedStatuses = ["TODO", "IN_PROGRESS", "DONE"] as const;
    let normalizedStatus: "TODO" | "IN_PROGRESS" | "DONE" | undefined =
      undefined;
    if (data.status) {
      const upper = data.status.toUpperCase();
      if (allowedStatuses.includes(upper as any)) {
        normalizedStatus = upper as (typeof allowedStatuses)[number];
      }
    }
    const normalizedData = {
      ...data,
      status: normalizedStatus,
    };
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...normalizedData } : t
      ),
    }));
  },
  updateTask: async (id, data) => {
    const allowedStatuses = ["TODO", "IN_PROGRESS", "DONE"] as const;
    let normalizedStatus: "TODO" | "IN_PROGRESS" | "DONE" | undefined =
      undefined;
    if (data.status) {
      const upper = data.status.toUpperCase();
      if (allowedStatuses.includes(upper as any)) {
        normalizedStatus = upper as (typeof allowedStatuses)[number];
      }
    }
    const normalizedData = {
      ...data,
      status: normalizedStatus,
    };
    const updated = await appClient.tasks.updateTask(id, normalizedData);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    }));
  },
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  loadTasks: async (params) => {
    const tasks = await appClient.tasks.getTasks(params);
    set({ tasks });
  },
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  deleteTask: async (id) => {
    await appClient.tasks.deleteTask(id);
    get().removeTask(id);
  },
}));
