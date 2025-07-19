import React, { useState } from "react";
import type { Task } from "../lib/tasks-store";
import { motion } from "framer-motion";
import { useTasksStore } from "../lib/tasks-store";
import { Input } from "./input";
import { Textarea } from "./textarea";
import TaskOptionPopover from "./modals/task-option-popover";
import CollectionPopover from "./modals/collection-popover";
import LabelPopover from "./modals/label-popover";
import { PROGRESS_OPTIONS, COLLECTIONS } from "./modals/constants/tasks";

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
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status?.toLowerCase() || "todo");
  const [description, setDescription] = useState(task.description || "");
  const [collectionId, setCollectionId] = useState(task.collectionId || null);
  const [labels, setLabels] = useState<string[]>(extractLabelIds(task.labels));
  const [saving, setSaving] = useState(false);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    updateTask(task.id, {
      title,
      status: status ? status.toUpperCase() : undefined,
      description,
      collectionId: collectionId || undefined,
      labels,
    });
    setSaving(false);
    onClose();
  }

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
            <TaskOptionPopover
              label="Status"
              value={status}
              options={PROGRESS_OPTIONS}
              onChange={(opt) => setStatus(opt.value)}
              place="right"
            />
          </div>
          <div className="flex items-center justify-between gap-2 mt-2">
            <label className="block text-xs text-gray-500 font-medium">
              Collection
            </label>
            <CollectionPopover
              collections={COLLECTIONS}
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
          <div className="flex-1" />
          <div className="flex gap-2 justify-end pt-4 border-t border-gray-100 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
