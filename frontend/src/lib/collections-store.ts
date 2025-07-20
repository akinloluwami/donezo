import { create } from "zustand";
import { appClient } from "./app-client";

export type Collection = {
  id: string;
  name: string;
  color?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

type CollectionsStore = {
  collections: Collection[];
  setCollections: (collections: Collection[]) => void;
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, data: Partial<Collection>) => void;
  removeCollection: (id: string) => void;
  loadCollections: () => Promise<void>;
};

export const useCollectionsStore = create<CollectionsStore>((set) => ({
  collections: [],
  setCollections: (collections) => set({ collections }),
  addCollection: (collection) =>
    set((state) => ({ collections: [...state.collections, collection] })),
  updateCollection: (id, data) =>
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    })),
  removeCollection: (id) =>
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id),
    })),
  loadCollections: async () => {
    const collections = await appClient.collections.getCollections();
    set({ collections });
  },
}));
