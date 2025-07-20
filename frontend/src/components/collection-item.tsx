import { useState } from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Collection } from "../lib/collections-store";
import DeleteCollectionModal from "./modals/delete-collection-modal";

type CollectionItemProps = {
  collection: Collection;
  onEdit: (collection: Collection) => void;
};

export default function CollectionItem({
  collection,
  onEdit,
}: CollectionItemProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group h-12 flex items-center gap-3 py-2 px-3 rounded-2xl bg-white hover:bg-gray-50 transition-colors cursor-pointer w-full"
      onClick={() => onEdit(collection)}
    >
      <div
        className="w-4 h-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: collection.color || "#6366f1" }}
      />
      <span className="text-gray-800 truncate text-sm flex-1">
        {collection.name}
      </span>

      <button
        type="button"
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all duration-200 text-red-500 hover:text-red-600"
        onClick={(e) => {
          e.stopPropagation();
          setShowDeleteModal(true);
        }}
      >
        <Trash2 size={16} />
      </button>

      <DeleteCollectionModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        collection={collection}
      />
    </motion.div>
  );
}
