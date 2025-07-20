import type { Task } from "../lib/tasks-store";
import { PROGRESS_OPTIONS } from "./modals/constants/tasks";
import TaskOptionPopover from "./modals/task-option-popover";
import { useTasksStore } from "../lib/tasks-store";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCollectionsStore } from "../lib/collections-store";
import { format } from "date-fns";
import { Box } from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const progress = PROGRESS_OPTIONS.find(
    (opt) => opt.value.toUpperCase() === (task.status || "TODO").toUpperCase()
  );
  const StatusIcon = progress?.icon;
  const iconColor = progress?.color || "#64748b";
  const updateTask = useTasksStore((s) => s.updateTask);
  const updateTaskOptimistically = useTasksStore(
    (s) => s.updateTaskOptimistically
  );
  const setSelectedTaskId = useTasksStore((s) => s.setSelectedTaskId);
  const [isUpdating, setIsUpdating] = useState(false);
  const collections = useCollectionsStore((s) => s.collections);
  const collection = task.collectionId
    ? collections.find((c) => c.id === task.collectionId)
    : undefined;
  const dueDate = task.extras?.dueDate
    ? new Date(task.extras.dueDate)
    : undefined;

  function handlePopoverClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  function handleClick() {
    if (isUpdating) return;
    setSelectedTaskId(task.id);
  }

  async function handleStatusChange(opt: {
    label: string;
    value: string;
    icon: any;
    color?: string;
  }) {
    const newStatus = opt.value.toUpperCase() as
      | "TODO"
      | "IN_PROGRESS"
      | "DONE";

    updateTaskOptimistically(task.id, { status: newStatus });

    setIsUpdating(true);

    try {
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update task status:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div
      className={`h-12 flex items-center gap-3 py-2 px-3 rounded-2xl bg-white hover:bg-gray-50 transition-colors cursor-pointer ${
        isUpdating ? "opacity-60 pointer-events-none" : ""
      }`}
      onClick={handleClick}
    >
      {StatusIcon && (
        <div onClick={handlePopoverClick}>
          <TaskOptionPopover
            label="Progress"
            icon={StatusIcon}
            iconColor={iconColor}
            value={progress?.value}
            options={PROGRESS_OPTIONS}
            onChange={handleStatusChange}
          />
        </div>
      )}
      <span className="text-gray-800 truncate text-sm">{task.title}</span>

      <div className="flex items-center gap-2 ml-auto min-w-0">
        <span
          className="flex items-center justify-center"
          style={{ width: 10, minWidth: 10 }}
        >
          <AnimatePresence>
            {isUpdating && (
              <motion.div
                key="updating-dot"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
            )}
          </AnimatePresence>
        </span>
        {dueDate && (
          <span className="text-xs text-gray-500 flex items-center">
            {format(dueDate, "d. MMM")}
          </span>
        )}
        {collection && (
          <span className="flex items-center text-xs text-gray-500">
            <Box
              size={14}
              color={collection.color || "#6366f1"}
              className="mr-1"
            />
            {collection.name}
          </span>
        )}
      </div>
    </div>
  );
}
