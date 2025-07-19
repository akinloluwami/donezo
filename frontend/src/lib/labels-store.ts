import { create } from "zustand";
import { appClient } from "./app-client";

export type Label = {
  id: string;
  name: string;
  color?: string;
};

type LabelsStore = {
  labels: Label[];
  setLabels: (labels: Label[]) => void;
  addLabel: (label: Label) => void;
  updateLabel: (id: string, data: Partial<Label>) => void;
  removeLabel: (id: string) => void;
  loadLabels: () => Promise<void>;
};

export const useLabelsStore = create<LabelsStore>((set) => ({
  labels: [],
  setLabels: (labels) => set({ labels }),
  addLabel: (label) => set((state) => ({ labels: [...state.labels, label] })),
  updateLabel: (id, data) =>
    set((state) => ({
      labels: state.labels.map((l) => (l.id === id ? { ...l, ...data } : l)),
    })),
  removeLabel: (id) =>
    set((state) => ({ labels: state.labels.filter((l) => l.id !== id) })),
  loadLabels: async () => {
    const labels = await appClient.labels.getLabels();
    set({ labels });
  },
}));
