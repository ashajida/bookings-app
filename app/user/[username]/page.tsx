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
import {
  AppointmentData,
  submitBookingAction,
} from "@/lib/actions/submit-booking-action";
import { useParams } from "next/navigation";
import { findAllBlockedDates } from "@/lib/utils/services/blocked-days/blocked-date-service";
import {
  findAllOperationTimes,
  findDaysOff,
  findOperationTime,
} from "@/lib/utils/services/operation-time/operation-time-service";
import { useForm, SubmitHandler } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  findUserByEmail,
  findUserByName,
} from "@/lib/utils/services/user/user-services";

type BookAppointmentResponse = {
  success: boolean;
  message: string;
  data: string[];
};

type ProgressState =
  | "Service"
  | "Aviability"
  | "CustomerDetails"
  | "Confirmation";

const customerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(4),
  lastName: z.string().min(4),
  phone: z.string().min(7),
});

type CustomerInputs = z.infer<typeof customerSchema>;

const User = () => {
  const [slots, setSlots] = useState<string[]>([]);
  const [visibleFrame, setVisibleFrame] = useState<ProgressState>("Service");
  const [services, setServices] = useState<Array<Service>>([]);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [userId, setUserId] = useState<string>("");
  //const [categories, setCategories] = useState<Array<Record<string, any>>>([]);
  const [appointmentData, setAppointmentData] = useState<
    Partial<AppointmentData>
  >({});
  const [blockedDates, setBlockedDates] = useState<{ [key: string]: any }[]>(
    []
  );

  const [blockedDaysArray, setBlockedDaysArray] = useState<number[]>([]);

  const params = useParams();
  const username = params.username;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInputs>({
    resolver: zodResolver(customerSchema),
  });

  const submitCustomerForm = (data: CustomerInputs) => {
    setAppointmentData({
      ...appointmentData,
      customer: data,
    });
    setVisibleFrame("Confirmation");
  };

  const handleSelect = async (date?: Date) => {
    if (!date) return;

    setDate(date);

    setAppointmentData({
      ...appointmentData,
      chosenDate: date,
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
    const serverName = target.dataset.serviceName;
    const price = target.dataset.servicePrice;

    console.log(target);
    if (!serviceId) return;
    setAppointmentData({
      serviceId: parseInt(serviceId),
      serviceName: serverName || "",
      price: price || "",
    });
    setVisibleFrame("Aviability");
  };

  const handleAviability = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;
    const time = target.dataset.timeslot;
    if (!time) return;

    //const { date } = appointmentData;

    //if (!date) return;

    const timeArray = time.split(":");

    setAppointmentData({
      ...appointmentData,
      hour: timeArray[0],
      minutes: timeArray[1],
    });

    setVisibleFrame("CustomerDetails");
  };

  useEffect(() => {
    const getServices = async () => {
      if (!username) return;
      try {
        const response = await findAllServices(username.toString());
        const user = await findUserByName(username.toString());

        if (response) {
          //const sorted = groupByCategory(response)
          console.log(response, "services.....");
          setServices(response);
        }
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getBlockedDates = async () => {
      if (!username) return;
      try {
        const response = await findAllBlockedDates(username.toString());
        console.log(response, "responses 12345");
        if (!response) return;
        setBlockedDates(response);
      } catch (error) {}
    };

    const getBlockedDays = async () => {
      if (!username) return;
      try {
        const response = await findDaysOff(username.toString());
        console.log(response, "off work days.....");

        if (!response) return;
        setBlockedDaysArray(response);
      } catch (error) {}
    };

    getServices();
    getBlockedDates();
    getBlockedDays();
    return () => {
      setServices([]);
      setBlockedDates([]);
    };
  }, [username]);

  return (
    <div className="container mx-auto px-4">
      <h1>Welcome to {username}</h1>
      <div className="min-w-fit w-[90%] md:w-[70%] mx-auto">
        {visibleFrame === "Service" && (
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
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
            <CardContent className="flex flex-col gap-3">
              {services.length > 0 &&
                services.map(
                  (
                    { serviceName, price, duration, id, description },
                    index
                  ) => {
                    return (
                      <Accordion
                        data-category={serviceName}
                        data-id={id}
                        key={index}
                        type="single"
                        collapsible
                        className="w-full"
                      >
                        <AccordionItem
                          value="item-1"
                          className="border rounded-md px-4"
                        >
                          <AccordionTrigger>{serviceName}</AccordionTrigger>
                          <AccordionContent className="flex gap-2 flex-col">
                            <span>{description}</span>
                            <span className="block">
                              &pound;{String(price)}
                            </span>
                            <span className="block">{duration} Mins</span>
                            <Button
                              data-id={id}
                              data-service-name={serviceName}
                              data-service-price={price}
                              onClick={handleBookService}
                            >
                              Book
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  }
                )}
            </CardContent>
          </Card>
        )}

        {visibleFrame === "Aviability" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Choose Date</CardTitle>
              <Button onClick={() => setVisibleFrame("Service")}>
                <ArrowLeft height={20} width={20} /> Back
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col :md-flex-row gap-6">
              <div className="w-fit">
                <Calendar
                  mode="single"
                  fromDate={new Date()}
                  selected={date}
                  defaultMonth={date}
                  disabled={{
                    dayOfWeek: blockedDaysArray,
                    ...(blockedDates.length
                      ? blockedDates.map((date) => new Date(date.date))
                      : []),
                  }}
                  onSelect={handleSelect}
                  className="rounded-md border h-fit align-items-center"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 flex-1 m-h-[260px] overflow-y-auto">
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
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Continue</Button>
            </CardFooter>
          </Card>
        )}
        {visibleFrame === "CustomerDetails" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Confirm Booking</CardTitle>
              <Button onClick={() => setVisibleFrame("Aviability")}>
                <ArrowLeft height={20} width={20} /> Back
              </Button>
            </CardHeader>
            <CardContent>
              <form
                className="flex gap-3 flex-col"
                onSubmit={handleSubmit(submitCustomerForm)}
              >
                <div>
                  <Input
                    type="text"
                    placeholder="First Name"
                    className="w-full"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    className="w-full"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <span className="text-red-500 text-sm">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Phone"
                    className="w-full"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-sm">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="w-full"
                    {...register("email")}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <Button disabled={isSubmitting}>
                  {isSubmitting ? "Loading..." : "Confirmation"}
                </Button>
              </form>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        )}

        {visibleFrame === "Confirmation" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Summary</CardTitle>
              <Button onClick={() => setVisibleFrame("CustomerDetails")}>
                <ArrowLeft height={20} width={20} /> Back
              </Button>
            </CardHeader>
            <CardContent>
              <div className="">
                <span className="block">
                  {appointmentData.chosenDate?.toDateString()}
                </span>
                <span className="block">
                  {appointmentData.hour}:{appointmentData.minutes}
                </span>
                <span className="block">{appointmentData.serviceName}</span>
                <span className="block">${appointmentData.price}</span>
              </div>
            </CardContent>
            <CardFooter>
              <form
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const {
                    status,
                    hour,
                    minutes,
                    serviceId,
                    chosenDate,
                    customer,
                    serviceName,
                    price,
                  } = appointmentData;

                  console.log(appointmentData, "appointment data......1");

                  if (!status) return;
                  if (!hour) return;
                  if (!minutes) return;
                  if (!serviceId) return;
                  if (!chosenDate) return;
                  if (!customer) return;
                  if (!serviceName) return;
                  if (!price) return;

                  submitBookingAction({
                    userId,
                    status,
                    hour,
                    minutes,
                    serviceId,
                    chosenDate,
                    customer,
                    serviceName,
                    price,
                  });
                }}
              >
                <Button variant="outline">Checkout</Button>
              </form>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default User;
