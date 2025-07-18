import { Router, Request, Response } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task";

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
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.get("/", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { collectionId } = req.query;
  const result = await getTasks({
    userId,
    collectionId: collectionId as string | undefined,
  });
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
  const { title, description, status, extras } = req.body;
  const result = await updateTask({
    userId,
    id,
    title,
    description,
    status,
    extras,
  });
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const result = await deleteTask({ userId, id });
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).send();
});

export default router;
