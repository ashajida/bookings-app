"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import OperationTimeHourMinute from "./OperationTimeHourMinute";
import { createOperationTime } from "@/lib/utils/services/operation-time/operation-time-service";
import { validateRequest } from "@/lib/validateRequest";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { operationTimeAction } from "@/lib/actions/operation-time-action";

const Preferences = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="container">
      <div className="grid">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] max-w-[90%] p-8">
          <form className="flex gap-3 flex-col" action={operationTimeAction}>
            <div className="flex flex-wrap gap-3">
              <OperationTimeHourMinute />
            </div>
            <Button variant="outline">Submit</Button>
          </form>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <form>
            <button>Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
