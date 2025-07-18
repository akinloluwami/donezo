import { Router, Request, Response } from "express";
import {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} from "../services/collection";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { name } = req.body;
  const result = await createCollection({ userId, name });
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.get("/", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const result = await getCollections({ userId });
  return res.status(result.status).json(result.data);
});

router.get("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const result = await getCollectionById({ userId, id });
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.put("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const { name } = req.body;
  const result = await updateCollection({ userId, id, name });
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const result = await deleteCollection({ userId, id });
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).send();
});

export default router;
