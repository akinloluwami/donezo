import type {
  ProgressOption,
  PriorityOption,
  LabelOption,
} from "../types/tasks";
import {
  CircleDashed,
  Loader2,
  CheckCircle,
  Minus,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
} from "lucide-react";

export const PROGRESS_OPTIONS: ProgressOption[] = [
  { label: "Todo", value: "todo", icon: CircleDashed, color: "#64748b" },
  {
    label: "In Progress",
    value: "in_progress",
    icon: Loader2,
    color: "#0ea5e9",
  },
  { label: "Done", value: "done", icon: CheckCircle, color: "#22c55e" },
];

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { label: "No priority", value: "", icon: Minus, color: "#a3a3a3" },
  { label: "Low", value: "low", icon: ArrowDown, color: "#38bdf8" },
  { label: "Medium", value: "medium", icon: Minus, color: "#facc15" },
  { label: "High", value: "high", icon: ArrowUp, color: "#ef4444" },
  { label: "Urgent", value: "urgent", icon: AlertTriangle, color: "#b91c1c" },
];

export const COLLECTIONS = [
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    name: "Personal",
    color: "#6366f1",
  }, // indigo
  {
    id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    name: "Work",
    color: "#2563eb",
  }, // blue
  {
    id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
    name: "Side Projects",
    color: "#16a34a",
  }, // green
  {
    id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a",
    name: "Errands",
    color: "#f59e42",
  }, // orange
];

export const SUGGESTION_LABELS: LabelOption[] = [
  { label: "Work", value: "work", color: "#2563eb" },
  { label: "Personal", value: "personal", color: "#7c3aed" },
  { label: "Bug", value: "bug", color: "#dc2626" },
  { label: "Feature", value: "feature", color: "#16a34a" },
];
