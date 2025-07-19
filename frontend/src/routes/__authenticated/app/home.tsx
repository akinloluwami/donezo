import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "../../../lib/user-store";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateTaskModal from "../../../components/modals/create-task";

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

  const [modalOpen, setModalOpen] = useState(false);

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div>
      <h2 className="text-2xl mb-4 text-gray-800">
        {greeting} {name}, <br />
        <span className="text-gray-500">
          It's {day}, {month} {date} - {dueTasks} tasks due today
        </span>
      </h2>

      <div
        className="h-12 rounded-2xl bg-gray-200/50 w-full flex items-center justify-between px-5 hover:bg-gray-200/70 transition-colors cursor-pointer"
        onClick={openModal}
      >
        <p className="text-sm text-gray-500">Create a task</p>
        <button
          className="bg-gray-300 size-5 flex items-center justify-center rounded-md"
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            openModal();
          }}
        >
          <Plus size={14} className="text-gray-600" />
        </button>
      </div>

      <CreateTaskModal open={modalOpen} onClose={closeModal} />
    </div>
  );
}
