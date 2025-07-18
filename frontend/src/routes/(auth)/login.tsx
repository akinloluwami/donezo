import { createFileRoute, Link } from "@tanstack/react-router";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { Card } from "../../components/card";

export const Route = createFileRoute("/(auth)/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 to-white/80">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign in to Donezo
        </h2>
        <form className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <Input name="email" type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <Input name="password" type="password" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full mt-2">
            Sign In
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/" className="text-accent font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
