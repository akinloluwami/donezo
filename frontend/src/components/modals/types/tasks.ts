import type { ComponentType } from "react";

export type ProgressOption = {
  label: string;
  value: string;
  icon: ComponentType<{ size?: number | string; color?: string }>;
  color?: string;
};

export type PriorityOption = {
  label: string;
  value: string;
  icon: ComponentType<{ size?: number | string; color?: string }>;
  color?: string;
};

export type LabelOption = {
  label: string;
  value: string;
  color: string;
};

export type Collection = {
  id: string;
  name: string;
  color: string;
};
