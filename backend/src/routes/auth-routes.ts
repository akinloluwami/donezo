import { Router, Request, Response } from "express";
import { signup, login } from "../services/auth";
import { validateSignup, validateLogin } from "../utils/validate-auth";
import { setAuthCookie } from "../utils/jwt";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const error = validateSignup(req.body);
  if (error) return res.status(400).json({ error });
  const result = await signup(req.body);
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.data);
});

router.post("/login", async (req: Request, res: Response) => {
  const error = validateLogin(req.body);
  if (error) return res.status(400).json({ error });
  const result = await login(req.body);
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  if (!result.data || !result.data.token)
    return res.status(500).json({ error: "Login failed" });
  setAuthCookie(res, result.data.token);
  return res.status(result.status).json({ success: true });
});

export default router;
