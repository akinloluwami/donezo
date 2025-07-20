import { create } from "zustand";
import { appClient } from "./app-client";
import { labelsDB } from "./indexed-db";

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

export const useLabelsStore = create<LabelsStore>((set, get) => ({
  labels: [],
  setLabels: (labels) => {
    set({ labels });
    labels.forEach((label) => labelsDB.add(label));
  },
  addLabel: (label) => {
    set((state) => ({ labels: [...state.labels, label] }));
    labelsDB.add(label);
  },
  updateLabel: (id, data) => {
    set((state) => ({
      labels: state.labels.map((l) => (l.id === id ? { ...l, ...data } : l)),
    }));
    const updatedLabel = get().labels.find((l) => l.id === id);
    if (updatedLabel) labelsDB.add(updatedLabel);
  },
  removeLabel: (id) => {
    set((state) => ({ labels: state.labels.filter((l) => l.id !== id) }));
    labelsDB.delete(id);
  },
  loadLabels: async () => {
    const labels = await appClient.labels.getLabels();
    set({ labels });
    for (const label of labels) {
      await labelsDB.add(label);
    }
  },
}));
