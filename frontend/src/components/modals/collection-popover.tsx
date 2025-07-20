import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Check } from "lucide-react";
import type { Collection } from "../../lib/collections-store";

export default function CollectionPopover({
  collections,
  selectedCollectionId,
  setSelectedCollectionId,
  place = "right",
}: {
  collections: Collection[];
  selectedCollectionId: string | null;
  setSelectedCollectionId: (id: string | null) => void;
  place?: "right" | "left";
}) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selected = collections.find((c) => c.id === selectedCollectionId);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        className={`flex items-center gap-x-1.5 text-black text-xs bg-gray-200 px-2 py-1 rounded-sm hover:bg-gray-300 transition-colors ${
          selected ? "opacity-100" : "opacity-60 hover:opacity-100"
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        <Box size={14} color={selected ? selected.color : undefined} />
        {selected ? selected.name : "Collection"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="collection-popover"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`absolute z-10 mt-1 min-w-[180px] bg-white border border-gray-200 rounded shadow-lg ${place === "left" ? "left-0" : "right-0"}`}
          >
            {collections.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No collections
              </div>
            ) : (
              collections.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  className={`flex items-center w-full gap-x-2 px-3 py-1.5 text-sm hover:bg-gray-100 relative ${
                    selectedCollectionId === col.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    setSelectedCollectionId(
                      col.id === selectedCollectionId ? null : col.id
                    );
                    setOpen(false);
                  }}
                >
                  <Box size={16} color={col.color} />
                  {col.name}
                  {selectedCollectionId === col.id && (
                    <span className="ml-auto flex items-center">
                      <Check size={16} className="text-blue-500" />
                    </span>
                  )}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
