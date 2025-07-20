import type { Task } from "../lib/tasks-store";
import { PROGRESS_OPTIONS } from "./modals/constants/tasks";
import TaskOptionPopover from "./modals/task-option-popover";
import { useTasksStore } from "../lib/tasks-store";
import React, { useState } from "react";
import { motion } from "framer-motion";

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
      {isUpdating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"
        />
      )}
    </div>
  );
}
