import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format, addDays, endOfWeek } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "../button";

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
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarValue, setCalendarValue] = useState<Date | null>(dueDate);
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

  function handleDueDateOption(option: string) {
    let date: Date | null = null;
    if (option === "tomorrow") {
      date = addDays(new Date(), 1);
      setDueDate(date);
      setOpen(false);
      return;
    } else if (option === "week") {
      date = addDays(new Date(), 7);
      setDueDate(date);
      setOpen(false);
      return;
    } else if (option === "endofweek") {
      date = endOfWeek(new Date(), { weekStartsOn: 1 });
      setDueDate(date);
      setOpen(false);
      return;
    } else if (option === "custom") {
      setCalendarValue(dueDate || new Date());
      setCalendarModalOpen(true);
      setOpen(false);
      return;
    }
    setDueDate(date);
    setOpen(false);
  }

  function handleSaveCalendarDate() {
    if (calendarValue) setDueDate(calendarValue);
    setCalendarModalOpen(false);
  }

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
            {format(dueDate, "MMM d")}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-1 min-w-[240px] bg-white border border-gray-200 rounded shadow-lg">
          <button
            type="button"
            className="flex w-full px-3 py-2 text-sm hover:bg-gray-100 items-center"
            onClick={() => handleDueDateOption("custom")}
          >
            Custom...
          </button>
          <button
            type="button"
            className="flex w-full px-3 py-2 text-sm hover:bg-gray-100 items-center"
            onClick={() => handleDueDateOption("tomorrow")}
          >
            <CalendarIcon size={14} className="mr-2 text-gray-400" />
            Tomorrow
            <span className="ml-auto text-xs text-gray-400">
              {format(addDays(new Date(), 1), "MMM d")}
            </span>
          </button>
          <button
            type="button"
            className="flex w-full px-3 py-2 text-sm hover:bg-gray-100 items-center"
            onClick={() => handleDueDateOption("week")}
          >
            <CalendarIcon size={14} className="mr-2 text-gray-400" />
            In one week
            <span className="ml-auto text-xs text-gray-400">
              {format(addDays(new Date(), 7), "MMM d")}
            </span>
          </button>
          <button
            type="button"
            className="flex w-full px-3 py-2 text-sm hover:bg-gray-100 items-center"
            onClick={() => handleDueDateOption("endofweek")}
          >
            <CalendarIcon size={14} className="mr-2 text-gray-400" />
            End of this week
            <span className="ml-auto text-xs text-gray-400">
              {format(endOfWeek(new Date(), { weekStartsOn: 1 }), "MMM d")}
            </span>
          </button>
          {dueDate && (
            <button
              type="button"
              className="flex w-full px-3 py-2 text-xs text-red-500 hover:bg-gray-100"
              onClick={() => setDueDate(null)}
            >
              Clear due date
            </button>
          )}
        </div>
      )}
      {/* Calendar Modal */}
      {calendarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs bg-opacity-40">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 min-w-[400px] relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setCalendarModalOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Add due date</h3>
            <div className="mb-4">
              <label className="block text-xs mb-1 text-gray-700 font-medium">
                Due Date{" "}
              </label>
              <input
                type="text"
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 mb-4"
                placeholder="DD/MM/YYYY"
                value={calendarValue ? format(calendarValue, "dd/MM/yyyy") : ""}
                readOnly
              />
              <div className="flex justify-center">
                <Calendar
                  onChange={(date: any) => setCalendarValue(date as Date)}
                  value={calendarValue}
                  calendarType="iso8601"
                  minDetail="month"
                  className="REACT-CALENDAR p-2 rounded bg-white text-black"
                  tileClassName={() => "!bg-white text-black"}
                  prev2Label={null}
                  next2Label={null}
                />
              </div>
            </div>
            <Button onClick={handleSaveCalendarDate} className="w-full mt-2">
              Save due date
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
