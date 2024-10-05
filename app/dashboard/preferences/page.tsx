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

  const submitOperationTime = async (formData: FormData) => {
   
    const { user } = await validateRequest();
    if (!user) return;

    const mondayOpeningHr = formData.get("monday-opening-hour") as string;
    if (!mondayOpeningHr) return;
    const mondayClosingHr = formData.get("monday-opening-hour") as string;
    if (!mondayClosingHr) return;

    const tuesdayOpeninHr = formData.get("monday-opening-hour") as string;
    if (!mondayOpeningHr) return;

    const closingHour = formData.get("closing-hour") as string;
    if (!formData.get("closing-hour")) return;

    const closingMinute = formData.get("closing-minute") as string;
    if (!closingMinute) return;

    const opening = new Date();
    opening.setHours(parseInt(openingHour), parseInt(openingMinute), 0, 0);

    const closing = new Date();
    closing.setHours(parseInt(closingHour), parseInt(closingMinute), 0, 0);

    const data = {
      monday: `${openingHour}:${openingMinute}`,
      tuesday: `${closingHour}:${closingMinute}`,
      wednesday: user.id,
      thursday,
      friday,
      saturday,
      sunday
    };

    try {
      const response = await createOperationTime(data);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

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
                action={submitOperationTime}
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
