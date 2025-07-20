import { openDB, type DBSchema } from "idb";

export const Status = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export const PriorityLevel = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;
export type PriorityLevel = (typeof PriorityLevel)[keyof typeof PriorityLevel];

interface TaskManagerDB extends DBSchema {
  users: {
    key: string;
    value: Partial<{
      id: string;
      email: string;
      password: string;
      name: string;
      hasCompletedOnboarding: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    indexes: { email: string };
  };
  tasks: {
    key: string;
    value: Partial<{
      id: string;
      title: string;
      description?: string;
      status?: Status;
      userId?: string;
      collectionId?: string;
      extrasId?: string;
      labelIds?: string[];
      createdAt?: string;
      updatedAt?: string;
    }>;
    indexes: { userId: string; collectionId: string };
  };
  labels: {
    key: string;
    value: Partial<{
      id: string;
      name: string;
      color?: string;
      userId?: string;
      taskIds?: string[];
      extrasIds?: string[];
    }>;
    indexes: { userId: string };
  };
  collections: {
    key: string;
    value: Partial<{
      id: string;
      name: string;
      color?: string;
      userId?: string;
      taskIds?: string[];
    }>;
    indexes: { userId: string };
  };
  extras: {
    key: string;
    value: Partial<{
      id: string;
      labels?: string[];
      dueDate?: string;
      priority?: PriorityLevel;
      taskId?: string;
    }>;
    indexes: { taskId: string };
  };
}

export const dbPromise = openDB<TaskManagerDB>("task-manager-db", 1, {
  upgrade(db) {
    const users = db.createObjectStore("users", { keyPath: "id" });
    users.createIndex("email", "email", { unique: true });

    const tasks = db.createObjectStore("tasks", { keyPath: "id" });
    tasks.createIndex("userId", "userId");
    tasks.createIndex("collectionId", "collectionId");

    const labels = db.createObjectStore("labels", { keyPath: "id" });
    labels.createIndex("userId", "userId");

    const collections = db.createObjectStore("collections", { keyPath: "id" });
    collections.createIndex("userId", "userId");

    const extras = db.createObjectStore("extras", { keyPath: "id" });
    extras.createIndex("taskId", "taskId", { unique: true });
  },
});

export const usersDB = {
  async add(user: TaskManagerDB["users"]["value"]) {
    const db = await dbPromise;
    await db.put("users", user);
  },
  async getById(id: string) {
    const db = await dbPromise;
    return db.get("users", id);
  },
  async getByEmail(email: string) {
    const db = await dbPromise;
    return db.getFromIndex("users", "email", email);
  },
  async getAll() {
    const db = await dbPromise;
    return db.getAll("users");
  },
  async delete(id: string) {
    const db = await dbPromise;
    await db.delete("users", id);
  },
};

export const tasksDB = {
  async add(task: TaskManagerDB["tasks"]["value"]) {
    const db = await dbPromise;
    await db.put("tasks", task);
  },
  async getById(id: string) {
    const db = await dbPromise;
    return db.get("tasks", id);
  },
  async getAll() {
    const db = await dbPromise;
    return db.getAll("tasks");
  },
  async getByUserId(userId: string) {
    const db = await dbPromise;
    return db.getAllFromIndex("tasks", "userId", userId);
  },
  async delete(id: string) {
    const db = await dbPromise;
    await db.delete("tasks", id);
  },
};

export const labelsDB = {
  async add(label: TaskManagerDB["labels"]["value"]) {
    const db = await dbPromise;
    await db.put("labels", label);
  },
  async getById(id: string) {
    const db = await dbPromise;
    return db.get("labels", id);
  },
  async getAll() {
    const db = await dbPromise;
    return db.getAll("labels");
  },
  async getByUserId(userId: string) {
    const db = await dbPromise;
    return db.getAllFromIndex("labels", "userId", userId);
  },
  async delete(id: string) {
    const db = await dbPromise;
    await db.delete("labels", id);
  },
};

export const collectionsDB = {
  async add(collection: TaskManagerDB["collections"]["value"]) {
    const db = await dbPromise;
    await db.put("collections", collection);
  },
  async getById(id: string) {
    const db = await dbPromise;
    return db.get("collections", id);
  },
  async getAll() {
    const db = await dbPromise;
    return db.getAll("collections");
  },
  async getByUserId(userId: string) {
    const db = await dbPromise;
    return db.getAllFromIndex("collections", "userId", userId);
  },
  async delete(id: string) {
    const db = await dbPromise;
    await db.delete("collections", id);
  },
};

export const extrasDB = {
  async add(extras: TaskManagerDB["extras"]["value"]) {
    const db = await dbPromise;
    await db.put("extras", extras);
  },
  async getById(id: string) {
    const db = await dbPromise;
    return db.get("extras", id);
  },
  async getByTaskId(taskId: string) {
    const db = await dbPromise;
    return db.getFromIndex("extras", "taskId", taskId);
  },
  async getAll() {
    const db = await dbPromise;
    return db.getAll("extras");
  },
  async delete(id: string) {
    const db = await dbPromise;
    await db.delete("extras", id);
  },
};
