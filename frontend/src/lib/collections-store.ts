import { create } from "zustand";
import { appClient } from "./app-client";
import { collectionsDB } from "./indexed-db";

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

export const useCollectionsStore = create<CollectionsStore>((set, get) => ({
  collections: [],
  setCollections: (collections) => {
    set({ collections });
    collections.forEach((collection) => collectionsDB.add(collection));
  },
  addCollection: (collection) => {
    set((state) => ({ collections: [...state.collections, collection] }));
    collectionsDB.add(collection);
  },
  updateCollection: (id, data) => {
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    }));
    const updatedCollection = get().collections.find((c) => c.id === id);
    if (updatedCollection) collectionsDB.add(updatedCollection);
  },
  removeCollection: (id) => {
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id),
    }));
    collectionsDB.delete(id);
  },
  loadCollections: async () => {
    const localCollectionsRaw = await collectionsDB.getAll();
    let localCollections: Collection[] = (localCollectionsRaw || []).filter(
      (c): c is Collection => !!c && typeof c.id === "string"
    );

    localCollections = localCollections.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
    if (localCollections.length > 0) {
      set({ collections: localCollections });
    }

    try {
      const collections = await appClient.collections.getCollections();
      set({ collections });
      for (const collection of collections) {
        await collectionsDB.add(collection);
      }
    } catch (err) {}
  },
}));
