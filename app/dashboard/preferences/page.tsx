"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  createOperationTime,
  findOperationTime,
} from "@/lib/repository/operation-time/operation-time";
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
import { blockDateAction } from "@/lib/actions/block-date-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OperationHoursSelect from "@/components/operation-hours-select/operation-hours-select";
import { OperationTime } from "@prisma/client";

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
    formData: FormData
  ) => {
    //e.preventDefault();

    const { user } = await validateRequest();
    if (!user) return;

    const data = {
      sunday: `${formData.get("sunday-opening")},${formData.get("sunday-closing")}` as string,
      monday: `${formData.get("monday-opening")},${formData.get("monday-closing")}})` as string,
      tuesday: `${formData.get("tuesday-opening")},${formData.get("tuesday-closing")}})` as string,
      wednesday: `${formData.get("wednesday-opening")},${formData.get("wednesday-closing")}})` as string,
      thursday: `${formData.get("thursday-opening")},${formData.get("thursday-closing")}})` as string,
      friday: `${formData.get("friday-opening")},${formData.get("friday-closing")}})` as string,
      saturday: `${formData.get("saturday-opening")},${formData.get("saturday-closing")}})` as string,
    }

    try {
      const response = await createOperationTime(data, user.id);
      //const data = await response.json();
      console.log(data , 'data.........................4');
    } catch (error) {
      console.log(error);
    }
  };

  const [operationTimes, setOperationTimes] = useState<Partial<OperationTime>>(
    {}
  );

  useEffect(() => {
    const getOperationTimes = async () => {
      const { user } = await validateRequest();
      if (!user) return;
      try {
        const response = await findOperationTime(user.id);
        console.log(response, 'response')

        if (!response) return;
        setOperationTimes(response);
      } catch (error) {}
    };

    getOperationTimes();

    return () => {
      setOperationTimes({});
    };
  }, []);

  return (
    <div className="container">
      <div className="">
        <div className="flex gap-4">
          <Card className="w-[350px] min-w-fit">
            <CardHeader>
              <CardTitle>Operation Days & Time</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="flex gap-3 flex-col"
                action={handleOperationTimeSubmit}
              >
                {weekDays.map((day, index) => {
                  return (
                    <React.Fragment key={index}>
                      <OperationHoursSelect
                        day={day as DayStrings}
                        opening={
                          operationTimes
                            ? operationTimes[day as DayStrings]?.split(",")[0]
                            : ""
                        }
                        closing={
                          operationTimes
                            ? operationTimes[day as DayStrings]?.split(",")[1]
                            : ""
                        }
                      />
                    </React.Fragment>
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
