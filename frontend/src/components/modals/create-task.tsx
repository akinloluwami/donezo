import { useRef, useState } from "react";
import { Modal } from "../modal";
import { Box, CircleDashed, Ellipsis } from "lucide-react";

type CreateTaskModalProps = {
  open: boolean;
  onClose: () => void;
};

function TaskOptionButton({
  label,
  icon: Icon,
  value,
}: {
  label: string;
  icon?: React.ComponentType<{ size?: number | string }>;
  value?: string;
}) {
  return (
    <button
      className={`flex items-center gap-x-1.5 text-black text-xs bg-gray-200 px-2 py-1 rounded-sm hover:bg-gray-300 transition-colors ${
        value ? "opacity-100" : "opacity-60 hover:opacity-100"
      }`}
    >
      {Icon && <Icon size={14} />}
      {value || label}
    </button>
  );
}

export default function CreateTaskModal({
  open,
  onClose,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Add actual create task logic here (API call, etc)
    setTimeout(() => {
      setLoading(false);
      setTitle("");
      setDescription("");
      onClose();
    }, 700);
  }

  function handleCancel() {
    setTitle("");
    setDescription("");
    onClose();
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }

  // Optionally, auto-resize on mount or when description changes
  // useEffect(() => {
  //   if (textareaRef.current) {
  //     textareaRef.current.style.height = 'auto';
  //     textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
  //   }
  // }, [description]);

  return (
    <Modal open={open} onClose={handleCancel}>
      <h3 className="text-sm font-medium">New Task</h3>
      <div className="mt-5">
        <input
          type="text"
          placeholder="Task title"
          className="text-lg font-medium w-full focus:outline-none focus:ring-0"
        />
        <textarea
          ref={textareaRef}
          className="mt-2 w-full resize-none focus:outline-none max-h-60"
          placeholder="Add description..."
          value={description}
          onChange={handleDescriptionChange}
          rows={1}
        />
        <div className="mt-3 flex items-center gap-x-2">
          <TaskOptionButton label="Progress" value="Todo" icon={CircleDashed} />
          <TaskOptionButton label="Priority" value="" icon={Ellipsis} />
          <TaskOptionButton label="Collection" value="" icon={Box} />
        </div>
      </div>
    </Modal>
  );
}
