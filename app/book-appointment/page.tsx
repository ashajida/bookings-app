"use client";

import React, { FormEvent, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BookAppointmentResponse = {
  success: boolean,
  message: string,
  data: string[]
}

type Slots = {
  time: string,
  duration: number
}

const BookAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [slots, setSlots] = useState<string[]>([]);

  const [visibleFrame, setVisibleFrame] = useState("");

  const handleSelect = async (date?: Date) => {
    setDate(date);
    try {
      const response = await fetch('/api/avialability', {
        method: 'POST',
        body: `${date?.getDate()}`
      });
      const data = await response.json() as BookAppointmentResponse;
      setSlots(data.data)
    } catch (error) {
      console.log(error)
    }
  };

  const handleBookAppointment = () => {
    try {
    } catch (error) {}
  };

  const handleCustomerForm = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const form = new FormData(target);
    console.log({
      date,
      name: form.get("name"),
      email: form.get("email"),
    });
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-col-2">
        <div className="col-span-1 mx-auto">
          <div>
            <Button variant="outline">prev</Button>
            <Button variant="outline">next</Button>
          </div>
          <div className="w-full p-10 flex gap-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              className="rounded-md border"
            />
            <div className="flex flex-wrap gap-2">
            {
             (slots && slots.length > 0)
              &&
              slots.map((slot, index) => {
                return(
                  <Button variant="outline" key={index}>{slot}</Button>
                );
              })
            }
            </div>
          </div>
          <Button variant="outline" onClick={handleBookAppointment}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
