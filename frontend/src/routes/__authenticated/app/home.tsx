import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "../../../lib/user-store";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import CreateTaskModal from "../../../components/modals/create-task";
import { useTasksStore } from "../../../lib/tasks-store";
import TaskItem from "../../../components/task-item";
import { motion, AnimatePresence } from "motion/react";
import { appClient } from "../../../lib/app-client";
import { useTypingEffect } from "../../../components/use-typing-effect";

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

  const [dueTasks, setDueTasks] = useState<number | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(true);

  const dueTasksText =
    dueTasks !== null && !loadingInsights
      ? ` - ${dueTasks} due task${dueTasks === 1 ? "" : "s"}.`
      : "";
  const animatedDueTasksText = useTypingEffect(dueTasksText, { delay: 30 });

  const tasks = useTasksStore((s) => s.tasks);

  useEffect(() => {
    let mounted = true;
    async function fetchInsights() {
      setLoadingInsights(true);
      try {
        const insights = await appClient.tasks.getInsights();
        const byStatus = insights?.byStatus || [];
        const due = byStatus
          .filter((s: any) => s.status !== "DONE")
          .reduce((acc: number, s: any) => acc + (s.count || 0), 0);
        if (mounted) setDueTasks(due);
      } catch (e) {
        if (mounted) setDueTasks(null);
      } finally {
        if (mounted) setLoadingInsights(false);
      }
    }
    fetchInsights();
    return () => {
      mounted = false;
    };
  }, [tasks]);

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
          It's {day}, {month} {date}
          {dueTasks !== null && !loadingInsights && (
            <span>{animatedDueTasksText}</span>
          )}
        </span>
      </h2>

      <div
        className="h-12 rounded-2xl bg-white/80 w-full flex items-center justify-between px-5 hover:bg-gray-200/70 transition-colors cursor-pointer mt-10"
        onClick={openModal}
      >
        <p className="text-sm text-gray-500">Create a task</p>
        <button
          className="bg-gray-300/70 size-5 flex items-center justify-center rounded-md"
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

      <div className="mt-5 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {tasks
            .filter((task) => task.status !== "DONE")
            .map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TaskItem task={task} />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
