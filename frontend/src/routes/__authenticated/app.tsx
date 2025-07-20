import { createFileRoute, Outlet } from "@tanstack/react-router";
import Sidebar from "../../components/sidebar";
import { useEffect, useState } from "react";
import { useLabelsStore } from "../../lib/labels-store";
import { useTasksStore } from "../../lib/tasks-store";
import TaskSideSheet from "../../components/task-side-sheet";
import { AnimatePresence } from "framer-motion";
import { useCollectionsStore } from "../../lib/collections-store";
import { Menu } from "lucide-react";

export const Route = createFileRoute("/__authenticated/app")({
  component: RouteComponent,
});

function RouteComponent() {
  const loadLabels = useLabelsStore((s) => s.loadLabels);
  const loadTasks = useTasksStore((s) => s.loadTasks);
  const loadCollections = useCollectionsStore((s) => s.loadCollections);
  const tasks = useTasksStore((s) => s.tasks);
  const selectedTaskId = useTasksStore((s) => s.selectedTaskId);
  const setSelectedTaskId = useTasksStore((s) => s.setSelectedTaskId);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadLabels();
    loadTasks();
    loadCollections();
  }, [loadLabels, loadTasks, loadCollections]);

  return (
    <div className="flex h-screen bg-[#eceef0] relative">
      <button
        className="absolute top-2 left-4 z-50 lg:hidden p-2 rounded-full bg-white/40 shadow transition-colors cursor-pointer hover:bg-white/60"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={14} />
      </button>
      <div className="bg-[#7eb3f4]/50 h-[900px] w-full opacity-50 rounded-full absolute -top-[800px] left-1/2 -translate-x-1/2 blur-3xl z-0 pointer-events-none"></div>

      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="py-10 max-w-3xl w-full mx-auto px-5 lg:px-10">
        <Outlet />
      </div>
      <AnimatePresence>
        {selectedTask && (
          <TaskSideSheet
            task={selectedTask}
            onClose={() => setSelectedTaskId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
