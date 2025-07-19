import prisma from "../db/prisma-client";
import type { Status } from "@prisma/client";

type ExtrasInput = {
  labelIds?: string[];
  dueDate?: Date;
  priority?: number;
};

// Helper to map string priority to enum
function mapPriority(priority?: string): any {
  if (!priority) return undefined;
  const map: Record<string, string> = {
    low: "LOW",
    medium: "MEDIUM",
    high: "HIGH",
    urgent: "URGENT",
  };
  const val = priority.toLowerCase();
  return map[val] || undefined;
}

// Helper to map string status to enum
function mapStatus(status?: string): any {
  if (!status) return undefined;
  const map: Record<string, string> = {
    todo: "TODO",
    in_progress: "IN_PROGRESS",
    done: "DONE",
  };
  return map[status] || undefined;
}

export async function createTask({
  userId,
  collectionId,
  title,
  description,
  status,
  extras,
}: {
  userId: string;
  collectionId?: string;
  title: string;
  description?: string;
  status?: string;
  extras?: ExtrasInput;
}) {
  if (!title) return { status: 400, error: "Title is required" };
  const data: any = {
    title,
    description,
    status: mapStatus(status),
    userId,
    extras: extras
      ? {
          create: {
            dueDate: extras.dueDate,
            priority: mapPriority(extras.priority as any),
            labels:
              extras.labelIds && extras.labelIds.length > 0
                ? {
                    connect: extras.labelIds.map((id) => ({ id })),
                  }
                : undefined,
          },
        }
      : undefined,
  };
  if (collectionId) data.collectionId = collectionId;
  const task = await prisma.task.create({
    data,
    include: { extras: { include: { labels: true } } },
  });
  return { status: 201, data: task };
}

export async function getTasks({
  userId,
  collectionId,
  status,
  labelIds,
}: {
  userId: string;
  collectionId?: string;
  status?: Status;
  labelIds?: string[];
}) {
  const where: any = { userId };
  if (collectionId) where.collectionId = collectionId;
  if (status) where.status = status;
  let tasks;
  if (labelIds && labelIds.length > 0) {
    tasks = await prisma.task.findMany({
      where: {
        ...where,
        labels: {
          some: {
            id: { in: labelIds },
          },
        },
      },
      include: { extras: true, labels: true },
    });
  } else {
    tasks = await prisma.task.findMany({
      where,
      include: { extras: true, labels: true },
    });
  }
  return { status: 200, data: tasks };
}

export async function getTaskById({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  const task = await prisma.task.findFirst({
    where: { id, userId },
    include: { extras: true, labels: true },
  });
  if (!task) return { status: 404, error: "Task not found" };
  return { status: 200, data: task };
}

export async function updateTask({
  userId,
  id,
  title,
  description,
  status,
  collectionId,
  extras,
}: {
  userId: string;
  id: string;
  title?: string;
  description?: string;
  status?: string;
  collectionId?: string;
  extras?: ExtrasInput;
}) {
  const data: any = {
    title,
    description,
    status: mapStatus(status),
  };
  if (collectionId !== undefined) data.collectionId = collectionId;
  const task = await prisma.task.updateMany({
    where: { id, userId },
    data,
  });
  if (task.count === 0) return { status: 404, error: "Task not found" };

  // Optionally update extras here if needed
  if (extras) {
    const existingExtras = await prisma.extras.findUnique({
      where: { taskId: id },
    });
    if (existingExtras) {
      await prisma.extras.update({
        where: { taskId: id },
        data: {
          dueDate: extras.dueDate,
          priority: mapPriority(extras.priority as any),
          labels: extras.labelIds
            ? {
                set: extras.labelIds.map((labelId) => ({ id: labelId })),
              }
            : undefined,
        },
      });
    }
  }
  return {
    status: 200,
    data: { id, title, description, status, collectionId, extras },
  };
}

export async function deleteTask({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  const task = await prisma.task.deleteMany({ where: { id, userId } });
  if (task.count === 0) return { status: 404, error: "Task not found" };
  return { status: 204, data: null };
}

export async function getTaskInsights({ userId }: { userId: string }) {
  const total = await prisma.task.count({ where: { userId } });
  const byStatus = await prisma.task.groupBy({
    by: ["status"],
    where: { userId },
    _count: { status: true },
  });
  const byCollection = await prisma.task.groupBy({
    by: ["collectionId"],
    where: { userId },
    _count: { collectionId: true },
  });
  return {
    status: 200,
    data: {
      total,
      byStatus: byStatus.map((s) => ({
        status: s.status,
        count: s._count.status,
      })),
      byCollection: byCollection.map((c) => ({
        collectionId: c.collectionId,
        count: c._count.collectionId,
      })),
    },
  };
}
