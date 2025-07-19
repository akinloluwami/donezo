import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function DueDatePopover({
  dueDate,
  setDueDate,
  buttonClassName = "",
}: {
  dueDate: Date | null;
  setDueDate: (date: Date | null) => void;
  buttonClassName?: string;
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

  // Quick select handlers
  const handleQuickSelect = (option: "today" | "tomorrow" | "in2days") => {
    let date: Date;
    if (option === "today") {
      date = new Date();
    } else if (option === "tomorrow") {
      date = addDays(new Date(), 1);
    } else {
      date = addDays(new Date(), 2);
    }
    setDueDate(date);
    setOpen(false);
  };

  // Calendar select handler
  const handleCalendarChange = (date: Date) => {
    setDueDate(date);
    setOpen(false);
  };

  // Calendar tile class for selected date
  const tileClassName = ({ date }: { date: Date }) => {
    if (
      dueDate &&
      date.getFullYear() === dueDate.getFullYear() &&
      date.getMonth() === dueDate.getMonth() &&
      date.getDate() === dueDate.getDate()
    ) {
      return "!bg-blue-600 text-white rounded-xl !w-7 !h-10 flex items-center justify-center";
    }
    return "";
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        className={`flex items-center gap-x-1.5 text-black text-xs bg-gray-200 px-2 py-1 rounded-sm hover:bg-gray-300 transition-colors ${
          dueDate ? "opacity-100" : "opacity-60 hover:opacity-100"
        } ${buttonClassName}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Set due date"
      >
        <CalendarIcon size={14} />
        {dueDate && (
          <span className="ml-1 text-xs text-gray-700">
            {format(dueDate, "d. MMM")}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-2 min-w-[320px] bg-white border border-gray-200 rounded-xl shadow-xl p-4 flex flex-col items-center">
          <div className="flex gap-2 mb-4 w-full">
            <button
              className="flex-1 py-1 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => handleQuickSelect("today")}
              type="button"
            >
              Today
            </button>
            <button
              className="flex-1 py-1 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => handleQuickSelect("tomorrow")}
              type="button"
            >
              Tomorrow
            </button>
            <button
              className="flex-1 py-1 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => handleQuickSelect("in2days")}
              type="button"
            >
              In 2 days
            </button>
          </div>
          <Calendar
            onChange={(date: any) => handleCalendarChange(date as Date)}
            value={dueDate || new Date()}
            calendarType="iso8601"
            minDetail="month"
            className="REACT-CALENDAR p-1 rounded bg-white text-black border-none text-xs w-[180px]"
            tileClassName={tileClassName}
            prev2Label={null}
            next2Label={null}
          />
          {dueDate && (
            <button
              className="mt-4 text-xs text-red-500 hover:underline"
              onClick={() => {
                setDueDate(null);
                setOpen(false);
              }}
              type="button"
            >
              Clear due date
            </button>
          )}
        </div>
      )}
    </div>
  );
}
