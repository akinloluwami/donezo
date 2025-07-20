import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
import { useCollectionsStore } from "../../../lib/collections-store";
import CollectionModal from "../../../components/modals/collection-modal";
import CollectionItem from "../../../components/collection-item";
import type { Collection } from "../../../lib/collections-store";

export const Route = createFileRoute("/__authenticated/app/collections")({
  component: RouteComponent,
});

function RouteComponent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null
  );
  const collections = useCollectionsStore((s) => s.collections);

  function openCreateModal() {
    setEditingCollection(null);
    setModalOpen(true);
  }

  function openEditModal(collection: Collection) {
    setEditingCollection(collection);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingCollection(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 mt-1">
            Organize your tasks into collections
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-x-2 text-sm bg-gray-300/40 p-2 rounded-md cursor-pointer hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          Create new collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No collections yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first collection to start organizing your tasks
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {collections.map((collection) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              onEdit={openEditModal}
            />
          ))}
        </div>
      )}

      <CollectionModal
        open={modalOpen}
        onClose={closeModal}
        collection={editingCollection}
      />
    </div>
  );
}
