import prisma from "../db/prisma-client";
import bcrypt from "bcrypt";
import { issueJWT } from "../utils/jwt";

export async function signup({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { status: 409, error: "Email already in use" };
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name },
  });
  const token = issueJWT(user.id);
  return {
    status: 201,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { status: 401, error: "Invalid credentials" };
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { status: 401, error: "Invalid credentials" };
  const token = issueJWT(user.id);
  return { status: 200, data: { token } };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });
  if (!user) return { status: 404, error: "User not found" };
  return { status: 200, data: user };
}
