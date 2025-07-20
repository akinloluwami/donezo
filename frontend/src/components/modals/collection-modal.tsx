import { useState, useEffect } from "react";
import { Modal } from "../modal";
import { useMutation } from "@tanstack/react-query";
import { appClient } from "../../lib/app-client";
import { useCollectionsStore } from "../../lib/collections-store";
import { toast } from "sonner";
import { collectionsDB } from "../../lib/indexed-db";
import { X } from "lucide-react";

type CollectionModalProps = {
  open: boolean;
  onClose: () => void;
  collection?: {
    id: string;
    name: string;
    color?: string;
  } | null;
};

const COLORS = [
  "#6366f1",
  "#2563eb",
  "#16a34a",
  "#f59e42",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#f97316",
];

export default function CollectionModal({
  open,
  onClose,
  collection,
}: CollectionModalProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const isEditing = !!collection;

  const updateCollection = useCollectionsStore((s) => s.updateCollection);

  const createMutation = useMutation({
    mutationFn: appClient.collections.createCollection,
    onError: () => {
      toast.error("Failed to create collection. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      appClient.collections.updateCollection(id, payload),
    onError: () => {
      toast.error("Failed to update collection. Please try again.");
    },
  });

  useEffect(() => {
    if (open) {
      if (collection) {
        setName(collection.name);
        setSelectedColor(collection.color || COLORS[0]);
      } else {
        setName("");
        setSelectedColor(COLORS[0]);
      }
    }
  }, [open, collection]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      color: selectedColor,
    };

    if (isEditing && collection) {
      updateCollection(collection.id, {
        name: name.trim(),
        color: selectedColor,
      });

      updateMutation.mutate(
        { id: collection.id, payload },
        {
          onSuccess: (updatedCollection) => {
            updateCollection(collection.id, updatedCollection);
            toast.success("Collection updated successfully");
            onClose();
          },
          onError: () => {
            updateCollection(collection.id, {
              name: collection.name,
              color: collection.color,
            });
          },
        }
      );
    } else {
      const optimisticCollection = {
        id: `temp-${Date.now()}`,
        name: name.trim(),
        color: selectedColor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setName("");
      setSelectedColor(COLORS[0]);
      onClose();

      useCollectionsStore
        .getState()
        .setCollections([
          optimisticCollection,
          ...useCollectionsStore.getState().collections,
        ]);

      createMutation.mutate(payload, {
        onSuccess: async (realCollection) => {
          const collections = useCollectionsStore.getState().collections;
          const collectionIndex = collections.findIndex(
            (c) => c.id === optimisticCollection.id
          );
          if (collectionIndex !== -1) {
            const updatedCollections = [...collections];

            updatedCollections.splice(collectionIndex, 1);
            await collectionsDB.delete(optimisticCollection.id);

            updatedCollections.unshift(realCollection);
            await collectionsDB.add(realCollection);
            useCollectionsStore.getState().setCollections(updatedCollections);
          }
          toast.success("Collection created successfully");
        },
        onError: () => {
          const collections = useCollectionsStore.getState().collections;
          const updatedCollections = collections.filter(
            (c) => c.id !== optimisticCollection.id
          );
          useCollectionsStore.getState().setCollections(updatedCollections);
          collectionsDB.delete(optimisticCollection.id);
        },
      });
    }
  }

  function handleCancel() {
    if (!isEditing) {
      setName("");
      setSelectedColor(COLORS[0]);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={handleCancel}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          {isEditing ? "Edit Collection" : "New Collection"}
        </h3>
        <button onClick={handleCancel}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-3">
        <input
          type="text"
          placeholder="Collection name"
          className="text-lg font-medium w-full focus:outline-none focus:ring-0"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Color</p>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-gray-800 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-accent/20 w-full mt-4">
          <button
            className="bg-accent text-white rounded-md p-2 mt-2 text-sm hover:bg-accent-hover transition-colors flex items-center justify-center gap-x-2 disabled:opacity-50"
            type="submit"
            disabled={
              createMutation.status === "pending" ||
              updateMutation.status === "pending" ||
              !name.trim()
            }
          >
            {createMutation.status === "pending" ||
            updateMutation.status === "pending"
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update collection"
                : "Create collection"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
