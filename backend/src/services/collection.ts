import prisma from "../db/prisma-client";

export async function createCollection({
  userId,
  name,
  color,
}: {
  userId: string;
  name: string;
  color?: string;
}) {
  if (!name) return { status: 400, error: "Name is required" };
  const collection = await prisma.collection.create({
    data: { name, userId, color },
  });
  return { status: 201, data: collection };
}

export async function getCollections({ userId }: { userId: string }) {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return { status: 200, data: collections };
}

export async function getCollectionById({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  const collection = await prisma.collection.findFirst({
    where: { id, userId },
  });
  if (!collection) return { status: 404, error: "Collection not found" };
  return { status: 200, data: collection };
}

export async function updateCollection({
  userId,
  id,
  name,
  color,
}: {
  userId: string;
  id: string;
  name: string;
  color?: string;
}) {
  if (!name) return { status: 400, error: "Name is required" };
  const collection = await prisma.collection.updateMany({
    where: { id, userId },
    data: { name, color },
  });
  if (collection.count === 0)
    return { status: 404, error: "Collection not found" };
  return { status: 200, data: { id, name, color } };
}

export async function deleteCollection({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  await prisma.task.updateMany({
    where: { collectionId: id, userId },
    data: { collectionId: null },
  });

  const collection = await prisma.collection.deleteMany({
    where: { id, userId },
  });
  if (collection.count === 0)
    return { status: 404, error: "Collection not found" };
  return { status: 204, data: null };
}
