import { useRef, useState, useEffect } from "react";
import { Modal } from "../modal";
import { CircleDashed, Ellipsis } from "lucide-react";
import TaskOptionPopover from "./task-option-popover";
import LabelPopover from "./label-popover";
import CollectionPopover from "./collection-popover";
import DueDatePopover from "./due-date-popover";
import { PROGRESS_OPTIONS, PRIORITY_OPTIONS } from "./constants/tasks";
import type { ProgressOption, PriorityOption } from "./types/tasks";
import { useMutation } from "@tanstack/react-query";
import { appClient } from "../../lib/app-client";
import { useTasksStore } from "../../lib/tasks-store";
import { useCollectionsStore } from "../../lib/collections-store";
import { toast } from "sonner";
import { tasksDB } from "../../lib/indexed-db";

type CreateTaskModalProps = {
  open: boolean;
  onClose: () => void;
  initialStatus?: string;
};

export default function CreateTaskModal({
  open,
  onClose,
  initialStatus,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState<ProgressOption["value"]>("TODO");
  const [priority, setPriority] = useState<PriorityOption["value"]>("");
  const [labels, setLabels] = useState<string[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueDatePopoverOpen, setDueDatePopoverOpen] = useState(false);
  const dueDatePopoverRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addTask = useTasksStore((s) => s.addTask);
  const collections = useCollectionsStore((s) => s.collections);

  const createTaskMutation = useMutation({
    mutationFn: appClient.tasks.createTask,
    onError: () => {
      toast.error("Failed to create task. Please try again.");
    },
  });

  useEffect(() => {
    if (!dueDatePopoverOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dueDatePopoverRef.current &&
        !dueDatePopoverRef.current.contains(e.target as Node)
      ) {
        setDueDatePopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dueDatePopoverOpen]);

  useEffect(() => {
    if (open && initialStatus) {
      setProgress(initialStatus as ProgressOption["value"]);
    }
  }, [open, initialStatus]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title,
      description,
      status: progress ? progress.toUpperCase() : undefined,
      collectionId: selectedCollectionId || undefined,
      extras: {
        labelIds: labels,
        priority: priority ? priority.toUpperCase() : undefined,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      },
    };

    const optimisticTask = {
      id: `temp-${Date.now()}`,
      title,
      description,
      status: (progress ? progress.toUpperCase() : "TODO") as
        | "TODO"
        | "IN_PROGRESS"
        | "DONE",
      collectionId: selectedCollectionId || undefined,
      extras: {
        id: `temp-extras-${Date.now()}`,
        labels: labels.map((id) => ({ id, name: id })),
        dueDate: dueDate ? dueDate.toISOString() : undefined,
        priority: priority
          ? (priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "URGENT")
          : undefined,
        taskId: `temp-${Date.now()}`,
      },
      labels: labels.map((id) => ({ id, name: id })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTask(optimisticTask);

    setTitle("");
    setDescription("");
    onClose();

    createTaskMutation.mutate(payload, {
      onSuccess: async (realTask) => {
        const tasks = useTasksStore.getState().tasks;
        const taskIndex = tasks.findIndex((t) => t.id === optimisticTask.id);
        if (taskIndex !== -1) {
          const updatedTasks = [...tasks];

          updatedTasks.splice(taskIndex, 1);
          await tasksDB.delete(optimisticTask.id);

          updatedTasks.unshift(realTask);
          await tasksDB.add(realTask);
          useTasksStore.getState().setTasks(updatedTasks);
        }
      },
      onError: () => {
        const tasks = useTasksStore.getState().tasks;
        const updatedTasks = tasks.filter((t) => t.id !== optimisticTask.id);
        useTasksStore.getState().setTasks(updatedTasks);
        tasksDB.delete(optimisticTask.id);
      },
    });
  }

  function handleCancel() {
    setTitle("");
    setDescription("");
    onClose();
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <h3 className="text-sm font-medium">New Task</h3>
      <form onSubmit={handleSubmit} className="mt-3">
        <input
          type="text"
          placeholder="Task title"
          className="text-lg font-medium w-full focus:outline-none focus:ring-0"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <textarea
          ref={textareaRef}
          className="mt-2 w-full resize-none focus:outline-none max-h-40"
          placeholder="Add description..."
          value={description}
          onChange={handleDescriptionChange}
          rows={1}
        />
        <div className="mt-3 flex items-center gap-x-2">
          <TaskOptionPopover
            label="Progress"
            icon={CircleDashed}
            iconColor="#0ea5e9"
            value={progress}
            options={PROGRESS_OPTIONS}
            onChange={(opt) => setProgress(opt.value)}
          />
          <TaskOptionPopover
            label="Priority"
            icon={Ellipsis}
            iconColor="#f59e42"
            value={priority}
            options={PRIORITY_OPTIONS}
            onChange={(opt) => setPriority(opt.value)}
          />
          <CollectionPopover
            collections={collections}
            selectedCollectionId={selectedCollectionId}
            setSelectedCollectionId={setSelectedCollectionId}
          />
          <LabelPopover selected={labels} setSelected={setLabels} />
          <DueDatePopover dueDate={dueDate} setDueDate={setDueDate} />
        </div>
        <div className="border-t border-accent/20 w-full mt-2">
          <button
            className="bg-accent text-white rounded-md p-2 mt-2 text-sm hover:bg-accent-hover transition-colors flex items-center justify-center gap-x-2 disabled:opacity-50"
            type="submit"
            disabled={createTaskMutation.status === "pending"}
          >
            {createTaskMutation.status === "pending"
              ? "Creating..."
              : "Create task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
