import { Modal } from "../modal";
import { Trash2, AlertTriangle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { appClient } from "../../lib/app-client";
import { useCollectionsStore } from "../../lib/collections-store";
import { toast } from "sonner";
import type { Collection } from "../../lib/collections-store";

type DeleteCollectionModalProps = {
  open: boolean;
  onClose: () => void;
  collection: Collection | null;
};

export default function DeleteCollectionModal({
  open,
  onClose,
  collection,
}: DeleteCollectionModalProps) {
  const removeCollection = useCollectionsStore((s) => s.removeCollection);

  const deleteMutation = useMutation({
    mutationFn: appClient.collections.deleteCollection,
    onError: () => {
      toast.error("Failed to delete collection. Please try again.");
    },
  });

  function handleDelete() {
    if (!collection) return;

    removeCollection(collection.id);
    onClose();

    deleteMutation.mutate(collection.id, {
      onSuccess: () => {
        toast.success("Collection deleted successfully");
      },
      onError: () => {
        const collections = useCollectionsStore.getState().collections;
        const updatedCollections = [...collections, collection];
        useCollectionsStore.getState().setCollections(updatedCollections);
      },
    });
  }

  function handleCancel() {
    onClose();
  }

  if (!collection) return null;

  return (
    <Modal open={open} onClose={handleCancel}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Delete Collection
          </h3>
          <p className="text-sm text-gray-500">This action cannot be undone</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 mb-3">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">"{collection.name}"</span>
          ? <br /> This will permanently remove the collection and all detach
          associated tasks.
        </p>

        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: collection.color || "#6366f1" }}
            />
            <span className="text-sm font-medium text-gray-700">
              {collection.name}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={deleteMutation.status === "pending"}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          disabled={deleteMutation.status === "pending"}
        >
          {deleteMutation.status === "pending" ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 size={16} />
              Delete Collection
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
