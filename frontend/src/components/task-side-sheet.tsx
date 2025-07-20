import React, { useState } from "react";
import type { Task } from "../lib/tasks-store";
import { motion } from "framer-motion";
import { useTasksStore } from "../lib/tasks-store";
import { Input } from "./input";
import { Textarea } from "./textarea";
import TaskOptionPopover from "./modals/task-option-popover";
import CollectionPopover from "./modals/collection-popover";
import LabelPopover from "./modals/label-popover";
import DueDatePopover from "./modals/due-date-popover";
import { PROGRESS_OPTIONS } from "./modals/constants/tasks";
import type { Label } from "../lib/labels-store";
import { toast } from "sonner";
import { useCollectionsStore } from "../lib/collections-store";

function extractLabelIds(labels: any[] | undefined): string[] {
  if (!labels) return [];
  return labels
    .map((l) => (typeof l === "string" ? l : l.id || l.value))
    .filter(Boolean);
}

interface TaskSideSheetProps {
  task: Task;
  onClose: () => void;
}

export default function TaskSideSheet({ task, onClose }: TaskSideSheetProps) {
  const updateTask = useTasksStore((s) => s.updateTask);
  const updateTaskOptimistically = useTasksStore(
    (s) => s.updateTaskOptimistically
  );
  const deleteTask = useTasksStore((s) => s.deleteTask);
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status || "TODO");
  const [description, setDescription] = useState(task.description || "");
  const [collectionId, setCollectionId] = useState(task.collectionId || null);
  const [labels, setLabels] = useState<string[]>(
    extractLabelIds(task.extras?.labels)
  );
  const [dueDate, setDueDate] = useState(
    task.extras?.dueDate ? new Date(task.extras.dueDate) : null
  );
  const [saving, setSaving] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function normalizeLabels(labels: any[] | undefined): Label[] {
    if (!labels) return [];
    return labels.map((l) =>
      typeof l === "string"
        ? { id: l, name: l }
        : { id: l.id, name: l.name, color: l.color, userId: l.userId }
    );
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
    setStatus(newStatus);

    setIsUpdatingStatus(true);

    try {
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update task status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const newStatus = status;
      const newLabels = normalizeLabels(labels);
      let newExtras = task.extras
        ? {
            ...task.extras,
            dueDate: dueDate ? dueDate.toISOString() : undefined,
            labelIds: labels,
          }
        : undefined;

      const updateData = {
        title,
        status: newStatus,
        description,
        collectionId: collectionId || undefined,
        labels: newLabels,
        ...(newExtras ? { extras: newExtras } : {}),
      };

      const tasks = useTasksStore.getState().tasks;
      const taskIndex = tasks.findIndex((t) => t.id === task.id);
      if (taskIndex !== -1) {
        const updatedTasks = [...tasks];
        const existingTask = updatedTasks[taskIndex];
        Object.assign(existingTask, updateData);
        useTasksStore.getState().setTasks(updatedTasks);
      }

      onClose();

      await updateTask(task.id, updateData);
    } catch (err) {
      console.error("Failed to update task:", err);
      toast.error("Failed to update task. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const collections = useCollectionsStore((s) => s.collections);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end items-center bg-black/1"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        className="bg-white h-[98%] w-full max-w-md rounded-2xl px-6 py-10 shadow relative flex flex-col"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-light"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-6 text-gray-800">Edit Task</h2>
        <form
          className="flex flex-col flex-1 space-y-4 overflow-y-auto"
          onSubmit={handleSave}
        >
          <div>
            <label className="block text-xs text-gray-500 font-medium mb-1">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Task title"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <label className="block text-xs text-gray-500 font-medium">
              Status
            </label>
            <div className="relative">
              <TaskOptionPopover
                label="Status"
                value={status}
                options={PROGRESS_OPTIONS}
                onChange={handleStatusChange}
                place="right"
              />
              {isUpdatingStatus && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 mt-2">
            <label className="block text-xs text-gray-500 font-medium">
              Collection
            </label>
            <CollectionPopover
              collections={collections}
              selectedCollectionId={collectionId}
              setSelectedCollectionId={setCollectionId}
              place="right"
            />
          </div>
          <div className="flex items-center justify-between gap-2 mt-2">
            <label className="block text-xs text-gray-500 font-medium">
              Labels
            </label>
            <LabelPopover
              selected={labels}
              setSelected={setLabels}
              place="right"
            />
          </div>
          <div className="flex items-center justify-between gap-2 mt-2">
            <label className="block text-xs text-gray-500 font-medium">
              Due date
            </label>
            <DueDatePopover
              dueDate={dueDate}
              setDueDate={setDueDate}
              place="right"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 font-medium mb-1">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="w-full resize-none max-h-40"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 text-sm bg-accent/30 text-accent hover:bg-accent/15 rounded-2xl disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Saving..." : "Update"}
          </button>
          <div className="flex-1" />
          <div className="flex gap-2 justify-end pt-4 border-t border-gray-100 mt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm bg-red-500/10 text-red-400 w-full rounded-2xl hover:bg-red-500/15 disabled:opacity-60"
              onClick={async () => {
                setIsDeleting(true);

                const tasks = useTasksStore.getState().tasks;
                const updatedTasks = tasks.filter((t) => t.id !== task.id);
                useTasksStore.getState().setTasks(updatedTasks);

                onClose();

                try {
                  await deleteTask(task.id);
                } catch (error) {
                  console.error("Failed to delete task:", error);
                  toast.error("Failed to delete task. Please try again.");
                } finally {
                  setIsDeleting(false);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
