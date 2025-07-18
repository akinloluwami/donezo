import prisma from "../db/prisma-client";
import type { Status } from "@prisma/client";

type ExtrasInput = {
  tags?: string[];
  dueDate?: Date;
  priority?: number;
};

export async function createTask({
  userId,
  collectionId,
  title,
  description,
  status,
  extras,
}: {
  userId: string;
  collectionId: string;
  title: string;
  description?: string;
  status?: string;
  extras?: ExtrasInput;
}) {
  if (!title) return { status: 400, error: "Title is required" };
  if (!collectionId) return { status: 400, error: "Collection is required" };
  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status as Status | undefined,
      userId,
      collectionId,
      extras: extras ? { create: extras } : undefined,
    },
    include: { extras: true },
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
  extras,
}: {
  userId: string;
  id: string;
  title?: string;
  description?: string;
  status?: string;
  extras?: ExtrasInput;
}) {
  const task = await prisma.task.updateMany({
    where: { id, userId },
    data: {
      title,
      description,
      status: status as Status | undefined,
    },
  });
  if (task.count === 0) return { status: 404, error: "Task not found" };
  // Optionally update extras here if needed
  return { status: 200, data: { id, title, description, status, extras } };
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
