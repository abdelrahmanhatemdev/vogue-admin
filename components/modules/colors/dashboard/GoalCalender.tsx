"use client";
import { memo, useState } from "react";
import { addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

const GoalCalender = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  return (
    <div className="flex flex-col gap-2 dark:bg-neutral-800 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg shadow-md w-72">
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        
      />
    </div>
  );
};
export default memo(GoalCalender);
