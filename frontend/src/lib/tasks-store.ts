import { create } from "zustand";
import { appClient } from "./app-client";
import { tasksDB } from "./indexed-db";

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
  setTasks: (tasks) => {
    set({ tasks });
    tasks.forEach((task) => tasksDB.add(task));
  },
  addTask: (task) => {
    set((state) => ({ tasks: [task, ...state.tasks] }));
    tasksDB.add(task);
  },
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
    const updatedTask = get().tasks.find((t) => t.id === id);
    if (updatedTask) tasksDB.add(updatedTask);
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
    await tasksDB.add({ ...updated, id });
  },
  removeTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    tasksDB.delete(id);
  },
  loadTasks: async (params) => {
    const localTasksRaw = await tasksDB.getAll();
    let localTasks: Task[] = (localTasksRaw || []).filter(
      (t): t is Task => !!t && typeof t.id === "string"
    );

    localTasks = localTasks.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
    if (localTasks.length > 0) {
      set({ tasks: localTasks });
    }

    try {
      const tasks = await appClient.tasks.getTasks(params);
      set({ tasks });
      for (const task of tasks) {
        await tasksDB.add(task);
      }
    } catch (err) {}
  },
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  deleteTask: async (id) => {
    await appClient.tasks.deleteTask(id);
    get().removeTask(id);
    await tasksDB.delete(id);
  },
}));
