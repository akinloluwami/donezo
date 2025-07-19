import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "../../../lib/user-store";

export const Route = createFileRoute("/__authenticated/app/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUserStore((s) => s.user);
  const name = user?.name || "there";

  const now = new Date();
  const day = now.toLocaleDateString(undefined, { weekday: "long" });
  const month = now.toLocaleDateString(undefined, { month: "short" });
  const date = now.getDate();

  const hour = now.getHours();
  let greeting = "Good morning";
  if (hour >= 5 && hour < 12) {
    greeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good evening";
  } else {
    greeting = "Good night";
  }

  // TODO: Replace with real due tasks count from API
  const dueTasks = 9;

  return (
    <div>
      <h2 className="text-2xl mb-4 text-gray-800">
        {greeting} {name}, <br />
        <span className="text-gray-500">
          It's {day}, {month} {date} - {dueTasks} tasks due today
        </span>
      </h2>
    </div>
  );
}
