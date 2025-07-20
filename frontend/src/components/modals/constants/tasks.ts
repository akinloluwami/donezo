import type { ProgressOption, PriorityOption } from "../types/tasks";
import {
  CircleDashed,
  CheckCircle,
  Minus,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  CircleDot,
} from "lucide-react";

export const PROGRESS_OPTIONS: ProgressOption[] = [
  { label: "Todo", value: "TODO", icon: CircleDashed, color: "#64748b" },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
    icon: CircleDot,
    color: "#0ea5e9",
  },
  { label: "Done", value: "DONE", icon: CheckCircle, color: "#22c55e" },
];

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { label: "No priority", value: "", icon: Minus, color: "#a3a3a3" },
  { label: "Low", value: "LOW", icon: ArrowDown, color: "#38bdf8" },
  { label: "Medium", value: "MEDIUM", icon: Minus, color: "#facc15" },
  { label: "High", value: "HIGH", icon: ArrowUp, color: "#ef4444" },
  { label: "Urgent", value: "URGENT", icon: AlertTriangle, color: "#b91c1c" },
];
