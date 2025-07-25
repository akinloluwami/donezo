import prisma from "../db/prisma-client";
import bcrypt from "bcrypt";
import { issueJWT } from "../utils/jwt";

const DEFAULT_LABELS = [
  { name: "Work", color: "#2563eb" },
  { name: "Personal", color: "#7c3aed" },
  { name: "Bug", color: "#dc2626" },
  { name: "Feature", color: "#16a34a" },
];

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
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, password: hashed, name },
    });
    await Promise.all(
      DEFAULT_LABELS.map((label) =>
        tx.label.create({
          data: { name: label.name, color: label.color, userId: user.id },
        })
      )
    );
    return user;
  });
  const token = issueJWT(result.id);
  return {
    status: 201,
    data: {
      id: result.id,
      email: result.email,
      name: result.name,
      hasCompletedOnboarding: result.hasCompletedOnboarding,
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
  return {
    status: 200,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
    },
    token,
  };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });
  if (!user) return { status: 404, error: "User not found" };
  return { status: 200, data: user };
}
