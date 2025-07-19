import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tag, Check } from "lucide-react";
import { useLabelsStore } from "../../lib/labels-store";
import { appClient } from "../../lib/app-client";

function getLabelId(opt: any) {
  return opt.id || opt.value;
}
function getLabelName(opt: any) {
  return opt.label || opt.name;
}
function getLabelColor(opt: any) {
  return opt.color;
}

export default function LabelPopover({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (labels: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [showInput, setShowInput] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("#6366f1");
  const [creating, setCreating] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const globalLabels = useLabelsStore((s) => s.labels);
  const addLabel = useLabelsStore((s) => s.addLabel);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setShowInput(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  let buttonText = null;
  let buttonDotColor: string | null = null;

  if (selected.length === 1) {
    const found = globalLabels.find((l) => getLabelId(l) === selected[0]);
    buttonText = found ? getLabelName(found) : null;
    buttonDotColor = found ? getLabelColor(found) : null;
  } else if (selected.length > 1) {
    buttonText = `${selected.length} labels`;
  }

  function toggleLabel(val: string) {
    if (selected.includes(val)) {
      setSelected(selected.filter((l) => l !== val));
    } else {
      setSelected([...selected, val]);
    }
  }

  async function handleAddLabel() {
    if (!newLabel.trim()) return;
    setCreating(true);
    try {
      const label = await appClient.labels.createLabel({
        name: newLabel.trim(),
        color: newColor,
      });
      addLabel(label);
      setNewLabel("");
      setNewColor("#6366f1");
      setShowInput(false);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        className={`flex items-center gap-x-1.5 text-black text-xs bg-gray-200 px-2 py-1 rounded-sm hover:bg-gray-300 transition-colors ${
          selected.length ? "opacity-100" : "opacity-60 hover:opacity-100"
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        {selected.length === 1 && buttonDotColor ? (
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: buttonDotColor }}
          />
        ) : (
          <Tag size={14} />
        )}
        {buttonText}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="label-popover"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 z-10 mt-1 min-w-[180px] bg-white border border-gray-200 rounded shadow-lg"
          >
            <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 flex items-center justify-between">
              <span>Labels</span>
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline px-1 py-0.5 rounded"
                onClick={() => setShowInput((v) => !v)}
              >
                {showInput ? "Cancel" : "Create"}
              </button>
            </div>
            {showInput && (
              <div className="flex items-center gap-x-2 px-3 pb-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 text-xs w-24"
                  placeholder="Label name"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  autoFocus
                  disabled={creating}
                />
                <div className="relative">
                  <button
                    type="button"
                    className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center p-0 cursor-pointer"
                    style={{ backgroundColor: newColor }}
                    onClick={() => colorInputRef.current?.click()}
                    tabIndex={-1}
                  />
                  <input
                    ref={colorInputRef}
                    type="color"
                    className="absolute left-0 top-0 w-0 h-0 opacity-0 pointer-events-none"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    tabIndex={-1}
                  />
                </div>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                  disabled={creating}
                  onClick={handleAddLabel}
                >
                  {creating ? "Adding..." : "Add"}
                </button>
              </div>
            )}
            {globalLabels.map((opt) => {
              const id = getLabelId(opt);
              const name = getLabelName(opt);
              const color = getLabelColor(opt);
              return (
                <button
                  key={id}
                  type="button"
                  className={`flex items-center w-full gap-x-2 px-3 py-1.5 text-sm hover:bg-gray-100 relative ${
                    selected.includes(id) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => toggleLabel(id)}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    style={
                      selected.includes(id) ? { color, fontWeight: 500 } : {}
                    }
                  >
                    {name}
                  </span>
                  {selected.includes(id) && (
                    <span className="ml-auto flex items-center">
                      <Check size={16} className="text-blue-500" />
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
