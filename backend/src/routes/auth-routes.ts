import { Router, Request, Response } from "express";
import { signup, login } from "../services/auth";
import { validateSignup, validateLogin } from "../utils/validate-auth";
import { setAuthCookie } from "../utils/jwt";
import requireAuth from "../middleware/require-auth";
import prisma from "../db/prisma-client";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const error = validateSignup(req.body);
  if (error) return res.status(400).json({ error });
  const result = await signup(req.body);
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  if (!result.data || !result.token)
    return res.status(500).json({ error: "Signup failed" });
  setAuthCookie(res, result.token);
  return res.status(result.status).json(result.data);
});

router.post("/login", async (req: Request, res: Response) => {
  const error = validateLogin(req.body);
  if (error) return res.status(400).json({ error });
  const result = await login(req.body);
  if (result.error)
    return res.status(result.status).json({ error: result.error });
  if (!result.data || !result.token)
    return res.status(500).json({ error: "Login failed" });
  setAuthCookie(res, result.token);
  return res.status(result.status).json(result.data);
});

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  return res.status(200).json({ message: "Logged out successfully" });
});

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        hasCompletedOnboarding: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
