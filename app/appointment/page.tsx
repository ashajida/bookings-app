"use client";

import React, { FormEvent, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { createUser } from "@/utils/user/user-services";
import { Input } from "@/components/ui/input";

const Appointment = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [visibleFrame, setVisibleFrame] = useState("");

  const handleSelect = async (date?: Date) => {
    return setDate(date);
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
          <div className="w-full p-10">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              className="rounded-md border"
            />
          </div>
          <Button variant="outline" onClick={handleBookAppointment}>
            Next
          </Button>
        </div>
        <div className="col-span-1 mx-auto">
          <form className="grid gap-2 w-full" onSubmit={handleCustomerForm}>
            <Input
              name="name"
              type="text"
              placeholder="Name"
              className="w-full"
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full"
            />
            <Input
              name="phone"
              type="phone"
              placeholder="phone"
              className="w-full"
            />
            <Button variant="outline">Submit</Button>
          </form>
        </div>
        <div className="col-span-1 max-auto">
          <Button variant="outline">Book Appointment</Button>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
