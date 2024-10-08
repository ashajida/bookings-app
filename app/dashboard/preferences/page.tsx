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
import { findAllBlockedDates } from "@/lib/utils/services/blocked-days/blocked-date-service";
import { blockDateAction } from "@/lib/actions/block-date-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import OperationHoursSelect from "@/components/operation-hours-select/operation-hours-select";

const Preferences = () => {
  const [date, setDate] = useState<Date>();
  const blockedDates = [];
  const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  type DayStrings =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

  const handleOperationTimeSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement | null;
    if (!target) return;

    const { user } = await validateRequest();
    if (!user) return;

    const formData = new FormData(target);

    try {
      const response = await fetch("/api/operation-time", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="">
        <div className="flex gap-4">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Operation Days & Time</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="flex gap-3 flex-col"
                onSubmit={handleOperationTimeSubmit}
              >
                {weekDays.map((day) => {
                  return (
                    <>
                      <OperationHoursSelect day={day as DayStrings} />
                    </>
                  );
                })}
                <Button variant="outline">Save</Button>
              </form>
            </CardContent>
          </Card>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Block Days Off</CardTitle>
            </CardHeader>
            <CardContent>
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
              <form action={() => blockDateAction(date)}>
                <input type="text" name="blocked-date" hidden />
                <Button variant="outline">Save</Button>
              </form>
              <div>
                {blockedDates?.length &&
                  blockedDates.map((blockedDate, index) => {
                    return (
                      <div key={index}>{blockedDate.date.toDateString()}</div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
