import type { IconType } from "./task-option-popover";

export default function TaskOptionButton({
  label,
  icon: Icon,
  iconColor,
  value,
}: {
  label: string;
  icon?: IconType;
  iconColor?: string;
  value?: string;
}) {
  return (
    <button
      className={`flex items-center gap-x-1.5 text-black text-xs bg-gray-200 px-2 py-1 rounded-sm hover:bg-gray-300 transition-colors ${
        value ? "opacity-100" : "opacity-60 hover:opacity-100"
      }`}
    >
      {Icon && <Icon size={14} color={iconColor} />}
      {value || label}
    </button>
  );
}
