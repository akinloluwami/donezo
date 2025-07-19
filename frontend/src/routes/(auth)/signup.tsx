import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Error } from "../../components/error";
import { appClient } from "../../lib/app-client";

export const Route = createFileRoute("/(auth)/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const signupMutation = useMutation({
    mutationFn: async (signupData: {
      name: string;
      email: string;
      password: string;
    }) => {
      return await appClient.auth.signup(signupData);
    },
    onMutate: () => {
      setError(null);
    },
    onSuccess: () => {
      navigate({ to: "/app/home" });
    },
    onError: (err: any) => {
      setError(err?.response?.data?.error || err?.message || "Signup failed.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!form.password) {
      setError("Password is required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    signupMutation.mutate({
      name: form.name,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 to-white/80">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create your Donezo account
        </h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Name</p>
            <Input
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
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
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </p>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && <Error message={error} />}
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={signupMutation.isPending}
            loading={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
