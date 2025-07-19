import type { Task } from "../lib/tasks-store";
import { PROGRESS_OPTIONS } from "./modals/constants/tasks";
import TaskOptionPopover from "./modals/task-option-popover";
import { useTasksStore } from "../lib/tasks-store";
import React from "react";

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
  const setSelectedTaskId = useTasksStore((s) => s.setSelectedTaskId);

  function handlePopoverClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  function handleClick() {
    setSelectedTaskId(task.id);
  }

  return (
    <div
      className="h-12 flex items-center gap-3 py-2 px-3 rounded-2xl bg-white hover:bg-gray-50 transition-colors cursor-pointer"
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
            onChange={(opt) => {
              updateTask(task.id, { status: opt.value.toUpperCase() });
            }}
          />
        </div>
      )}
      <span className="text-gray-800 truncate text-sm">{task.title}</span>
    </div>
  );
}
