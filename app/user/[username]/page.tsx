"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import { findAllServices } from "@/lib/utils/services/service/service-services";
import { findAllCategories } from "@/lib/utils/services/category/category-services";
import { validateRequest } from "@/lib/validateRequest";
import { Service } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { submitBookingAction } from "@/lib/actions/submitBookingAction";
import { useParams } from "next/navigation";

type BookAppointmentResponse = {
  success: boolean;
  message: string;
  data: string[];
};

export type AppointmentData = {
  serviceId: number;
  date: string;
  hour: string;
  minutes: string;
  status: string;
};

type ProgressState = "Service" | "Aviability" | "Confirmation";

const User = () => {
  const [slots, setSlots] = useState<string[]>([]);
  const [visibleFrame, setVisibleFrame] = useState<ProgressState>("Service");
  const [services, setServices] = useState<Array<Service>>([]);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  //const [categories, setCategories] = useState<Array<Record<string, any>>>([]);
  const [appointmentData, setAppointmentData] = useState<
    Partial<AppointmentData>
  >({});

  const params = useParams();
  const username = params.username;

  const handleSelect = async (date?: Date) => {
    if (!date) return;

    setAppointmentData({
      ...appointmentData,
      date: date.toString(),
      status: "pending",
    });

    try {
      const response = await fetch("/api/avialability", {
        method: "POST",
        body: JSON.stringify({
          username: username.toString(),
          chosenDate: date.toString(),
        }),
      });
      const data = (await response.json()) as BookAppointmentResponse;
      setSlots(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookService = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;
    const serviceId = target.dataset.id;
    console.log(target);
    if (!serviceId) return;
    setAppointmentData({
      serviceId: parseInt(serviceId),
    });
    setVisibleFrame("Aviability");
    console.log(appointmentData);
  };

  const handleAviability = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;
    const time = target.dataset.timeslot;
    if (!time) return;

    //const { date } = appointmentData;

    if (!date) return;

    console.log(date);

    const timeArray = time.split(":");

    setAppointmentData({
      ...appointmentData,
      date: date.toString(),
      hour: timeArray[0],
      minutes: timeArray[1],
    });

    setVisibleFrame("Confirmation");
    console.log(appointmentData);
  };

  useEffect(() => {
    const getServices = async () => {
      if (!username) return;
      try {
        const response = await findAllServices(username.toString());
        if (response) {
          //const sorted = groupByCategory(response)
          setServices(response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getCategories = async () => {
      try {
        const response = await findAllCategories();
        if (response) {
          setCategories(response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCategories();
    getServices();
    return () => {
      setServices([]);
    };
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1>Welcome to {username}</h1>
      <div className="w-[60%] mx-auto">
        {visibleFrame === "Service" && (
          <div className="w-full p-10 flex flex-col gap-2">
            {/* <div>
            {categories.length > 0 &&
              categories.map((category) => {
                return (
                  <>
                    <span className="block">{category.categoryName}</span>
                  </>
                );
              })}
          </div> */}
            {services.length > 0 &&
              services.map(({ serviceName, price, duration, id }, index) => {
                return (
                  <>
                    <Accordion
                      data-category={serviceName}
                      data-id={id}
                      key={id}
                      type="single"
                      collapsible
                      className="w-full"
                    >
                      <AccordionItem
                        value="item-1"
                        className="border rounded-md px-4"
                      >
                        <AccordionTrigger>{serviceName}</AccordionTrigger>
                        <AccordionContent className="flex gap-6 flex-col">
                          <span className="block">Classic Lashes</span>
                          <span className="block">{price}</span>
                          <span className="block">{duration}</span>
                          <Button data-id={id} onClick={handleBookService}>
                            Book
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                );
              })}
          </div>
        )}
        {visibleFrame === "Aviability" && (
          <div className="w-full p-10 flex gap-6">
            <Calendar
              mode="single"
              fromDate={new Date()}
              selected={date}
              onSelect={handleSelect}
              className="rounded-md border h-fit align-items-center"
            />
            <div className="flex flex-wrap gap-2 flex-1">
              {slots &&
                slots.length > 0 &&
                slots.map((slot, index) => {
                  return (
                    <Button
                      data-timeslot={slot}
                      variant="outline"
                      key={index}
                      onClick={handleAviability}
                    >
                      {slot}
                    </Button>
                  );
                })}
            </div>
          </div>
        )}
        {visibleFrame === "Confirmation" && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>helloo</p>
            </CardContent>
            <CardFooter>
              <form
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const { status, hour, minutes, serviceId, date } =
                    appointmentData;

                  if (!status) return;
                  if (!hour) return;
                  if (!minutes) return;
                  if (!serviceId) return;
                  if (!date) return;

                  submitBookingAction({
                    status,
                    hour,
                    minutes,
                    serviceId,
                    date,
                  });
                }}
              >
                <Button variant="outline">Confirm Booking</Button>
              </form>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default User;
