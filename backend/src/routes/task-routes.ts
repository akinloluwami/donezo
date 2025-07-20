import { Router, Request, Response } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskInsights,
} from "../services/task";
import type { Status } from "@prisma/client";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { collectionId, title, description, status, extras } = req.body;
  const result = await createTask({
    userId,
    collectionId,
    title,
    description,
    status,
    extras,
  });
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  return res.status(result.status).json(result.data);
});

router.get("/", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { collectionId, status, labelIds } = req.query;
  let parsedLabelIds: string[] | undefined = undefined;
  if (labelIds) {
    if (Array.isArray(labelIds)) {
      parsedLabelIds = labelIds as string[];
    } else if (typeof labelIds === "string") {
      parsedLabelIds = labelIds.split(",");
    }
  }
  let parsedStatuses: Status[] | undefined = undefined;
  if (status) {
    if (Array.isArray(status)) {
      parsedStatuses = status as Status[];
    } else if (typeof status === "string") {
      parsedStatuses = status.split(",") as Status[];
    }
  }
  const result = await getTasks({
    userId,
    collectionId: collectionId as string | undefined,
    status: parsedStatuses,
    labelIds: parsedLabelIds,
  });
  return res.status(result.status).json(result.data);
});

router.get("/insights", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const result = await getTaskInsights({ userId });
  return res.status(result.status).json(result.data);
});

router.get("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const result = await getTaskById({ userId, id });
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.put("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const { title, description, status, collectionId, extras } = req.body;
  const result = await updateTask({
    userId,
    id,
    title,
    description,
    status,
    collectionId,
    extras,
  });

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  return res.status(result.status).json(result.data);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const result = await deleteTask({ userId, id });
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  return res.status(result.status).send();
});

export default router;
