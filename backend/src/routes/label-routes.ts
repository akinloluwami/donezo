import { Router, Request, Response } from "express";
import {
  createLabel,
  getLabels,
  getLabelById,
  updateLabel,
  deleteLabel,
} from "../services/label";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { name, color } = req.body;
  const result = await createLabel({ userId, name, color });
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.get("/", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const result = await getLabels({ userId });
  return res.status(result.status).json(result.data);
});

router.get("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const result = await getLabelById({ userId, id });
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.put("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const { name, color } = req.body;
  const result = await updateLabel({ userId, id, name, color });
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const result = await deleteLabel({ userId, id });
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).send();
});

export default router;
