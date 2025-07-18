import prisma from "../db/prisma-client";

export async function createLabel({
  userId,
  name,
  color,
}: {
  userId: string;
  name: string;
  color?: string;
}) {
  if (!name) return { status: 400, error: "Name is required" };
  const label = await prisma.label.create({ data: { name, color, userId } });
  return { status: 201, data: label };
}

export async function getLabels({ userId }: { userId: string }) {
  const labels = await prisma.label.findMany({ where: { userId } });
  return { status: 200, data: labels };
}

export async function getLabelById({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  const label = await prisma.label.findFirst({ where: { id, userId } });
  if (!label) return { status: 404, error: "Label not found" };
  return { status: 200, data: label };
}

export async function updateLabel({
  userId,
  id,
  name,
  color,
}: {
  userId: string;
  id: string;
  name?: string;
  color?: string;
}) {
  const label = await prisma.label.updateMany({
    where: { id, userId },
    data: { name, color },
  });
  if (label.count === 0) return { status: 404, error: "Label not found" };
  return { status: 200, data: { id, name, color } };
}

export async function deleteLabel({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  const label = await prisma.label.deleteMany({ where: { id, userId } });
  if (label.count === 0) return { status: 404, error: "Label not found" };
  return { status: 204, data: null };
}
