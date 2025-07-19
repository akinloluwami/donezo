import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export type IconType = React.ComponentType<{
  size?: number | string;
  color?: string;
}>;

export default function TaskOptionPopover({
  label,
  icon: Icon,
  iconColor,
  value,
  options,
  onChange,
}: {
  label: string;
  icon?: IconType;
  iconColor?: string;
  value?: string;
  options: { label: string; value: string; icon: IconType; color?: string }[];
  onChange: (value: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((opt) => opt.value === value);
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

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        className={`flex items-center gap-x-1.5 text-black text-xs bg-gray-200 px-2 py-1 rounded-sm hover:bg-gray-300 transition-colors ${
          value ? "opacity-100" : "opacity-60 hover:opacity-100"
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        {(selected?.icon || Icon) && (
          <>
            {selected ? (
              <selected.icon size={14} color={selected.color} />
            ) : (
              Icon && <Icon size={14} color={iconColor} />
            )}
          </>
        )}
        {selected ? selected.label : label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="popover"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 z-10 mt-1 min-w-[180px] bg-white border border-gray-200 rounded shadow-lg"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`flex items-center w-full gap-x-2 px-3 py-1.5 text-sm hover:bg-gray-100 relative ${
                  value === opt.value ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <opt.icon size={16} color={opt.color} />
                {opt.label}
                {value === opt.value && (
                  <span className="ml-auto flex items-center">
                    <Check size={16} className="text-blue-500" />
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
