import { createFileRoute, Link } from "@tanstack/react-router";
import { MoveRight } from "lucide-react";
import { Button } from "../components/button";
import { useUserStore } from "../lib/user-store";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="relative z-0 px-5 lg:px-10">
      <div className="bg-[#7eb3f4]/50 size-[900px] rounded-full absolute -top-[800px] left-1/2 -translate-x-1/2 blur-3xl z-0 pointer-events-none"></div>
      <div className="relative w-full max-w-4xl h-20 rounded-full border border-gray-400/20 mx-auto z-10 mt-5 bg-white/10 backdrop-blur-lg p-5 flex items-center justify-between">
        <h1 className="font-medium text-lg">Donezo</h1>
        <div className="flex items-center gap-5">
          {!user && (
            <Link to="/login" className="text-gray-500">
              Login
            </Link>
          )}

          {user ? (
            <Link
              to="/app/home"
              className="bg-accent rounded-full text-white px-5 py-3 hover:bg-accent/90 transition-colors"
            >
              Go to app
            </Link>
          ) : (
            <Link
              to="/signup"
              className="bg-accent rounded-full text-white px-5 py-3 hover:bg-accent/90 transition-colors"
            >
              Sign up
            </Link>
          )}
        </div>
      </div>

      <div className="flex w-full max-w-4xl mx-auto lex-col mt-10 flex-col">
        <h1 className="lg:text-8xl text-5xl mt-14 font-bold text-gray-800">
          A more soulful
          <br />
          <span className="bg-gradient-to-r from-accent/70 to-gray-300 from-40% bg-clip-text text-transparent">
            task manager
          </span>
        </h1>
        <p className="text-gray-600 lg:text-xl mt-5 max-w-3xl">
          Designed to reduce overwhelm, Donezo makes it easy to plan, track, and
          complete tasks—your way.
        </p>

        {user ? (
          <Link to="/app/home" className="w-fit mt-10">
            <Button className="w-full">
              Go to app
              <MoveRight />
            </Button>
          </Link>
        ) : (
          <Link to="/signup" className="w-fit mt-10">
            <Button className="w-full">
              Get Started
              <MoveRight />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
