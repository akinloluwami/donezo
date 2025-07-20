import { createFileRoute } from "@tanstack/react-router";
import { useTasksStore } from "../../../lib/tasks-store";
import TaskItem from "../../../components/task-item";
import { CircleDotDashed, Layers2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import CreateTaskModal from "../../../components/modals/create-task";

const TABS = [
  { key: "all", label: "All Tasks", icon: Layers2 },
  { key: "active", label: "Active", icon: CircleDotDashed },
];

type TabKey = "all" | "active";

type StatusKey = "TODO" | "IN_PROGRESS" | "DONE";

const STATUS_LABELS: Record<StatusKey, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const STATUS_FOR_TAB: Record<TabKey, StatusKey[]> = {
  all: ["IN_PROGRESS", "TODO", "DONE"],
  active: ["IN_PROGRESS", "TODO"],
};

type TasksSearch = { tab?: TabKey };

function validateSearch(search: any): TasksSearch {
  if (search && (search.tab === "all" || search.tab === "active")) {
    return { tab: search.tab };
  }
  return {};
}

export const Route = createFileRoute("/__authenticated/app/tasks")({
  validateSearch,
  component: RouteComponent,
});

const TabButton = ({
  children,
  active,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & { active?: boolean }) => {
  return (
    <button
      className={
        `flex items-center gap-x-2 text-sm px-2 py-1 rounded-md cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ` +
        (active
          ? "bg-gray-500 text-white"
          : "bg-gray-300/80 hover:bg-gray-300 text-gray-700")
      }
      {...props}
    >
      {children}
    </button>
  );
};

function RouteComponent() {
  const tasks = useTasksStore((s) => s.tasks);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const tab: TabKey = search.tab === "active" ? "active" : "all";

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<StatusKey | null>(null);

  const grouped: Record<StatusKey, typeof tasks> = {
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  };
  for (const task of tasks) {
    const status = (task.status || "TODO") as StatusKey;
    if (grouped[status]) grouped[status].push(task);
  }

  const visibleStatuses = STATUS_FOR_TAB[tab];

  function handleOpenModal(status: StatusKey) {
    setModalStatus(status);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setModalStatus(null);
  }

  return (
    <div>
      <CreateTaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        initialStatus={modalStatus!}
      />
      <div className="flex gap-x-4 mb-5">
        {TABS.map(({ key, label, icon: Icon }) => (
          <TabButton
            key={key}
            active={tab === key}
            onClick={() => navigate({ search: { tab: key } })}
            aria-current={tab === key ? "page" : undefined}
          >
            <Icon size={14} /> {label}
          </TabButton>
        ))}
      </div>
      <div className="space-y-8 mt-10">
        {visibleStatuses.map((status) => (
          <div key={status} className="">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-800 text-base">
                  {STATUS_LABELS[status]}
                </span>
                <span className="text-xs bg-gray-200 rounded px-2 py-0.5 text-gray-600">
                  {grouped[status].length}
                </span>
              </div>
              <button
                className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition-colors text-xs"
                type="button"
                onClick={() => handleOpenModal(status)}
              >
                <Plus size={14} />
                <span>New</span>
              </button>
            </div>
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {grouped[status].map((task) => (
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
        ))}
      </div>
    </div>
  );
}
