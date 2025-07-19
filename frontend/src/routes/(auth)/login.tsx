import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Error } from "../../components/error";
import { appClient } from "../../lib/app-client";
import { useUserStore } from "../../lib/user-store";

export const Route = createFileRoute("/(auth)/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const setUser = useUserStore((s) => s.setUser);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      appClient.auth.login(payload),
    onMutate: () => {
      setError(null);
    },
    onSuccess: (data) => {
      if (data) {
        setUser(data);
      }
      navigate({ to: "/app/home" });
    },
    onError: (err: any) => {
      setError(err?.response?.data?.error || err?.message || "Login failed.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!form.password) {
      setError("Password is required");
      return;
    }
    loginMutation.mutate({ email: form.email, password: form.password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 to-white/80">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign in to Donezo
        </h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          {error && <Error message={error} />}
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loginMutation.isPending}
            loading={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-accent font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
