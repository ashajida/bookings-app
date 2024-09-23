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
import { findAllServices } from "@/utils/services/service/service-services";
import { findAllCategories } from "@/utils/services/category/category-services";

type BookAppointmentResponse = {
  success: boolean;
  message: string;
  data: string[];
};

type ProgressState = "Service" | "Aviability" | "Confirmation";

const BookAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<string[]>([]);
  const [visibleFrame, setVisibleFrame] = useState<ProgressState>("Service");
  const [services, setServices] = useState<{ [key: string]: any }[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: any }[]>([]);

  const handleSelect = async (date?: Date) => {
    setDate(date);
    try {
      const response = await fetch("/api/avialability", {
        method: "POST",
        body: `${date?.getDate()}`,
      });
      const data = (await response.json()) as BookAppointmentResponse;
      setSlots(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const groupByCategory = (services) => {
    return services.reduce((acc, service) => {
      const categoryName = service.category.categoryName;

      // Check if the category already exists
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }

      // Add the service to the corresponding category
      acc[categoryName].push(service);
      return acc;
    }, {});
  };

  useEffect(() => {
    const getServices = async () => {
      try {
        const response = await findAllServices();
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
        if(response) {
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
      <div className="w-[60%] mx-auto">
        <div className="w-full p-10 flex gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            className="rounded-md border h-fit align-items-center"
          />
          <div className="flex flex-wrap gap-2 flex-1">
            {slots &&
              slots.length > 0 &&
              slots.map((slot, index) => {
                return (
                  <Button variant="outline" key={index}>
                    {slot}
                  </Button>
                );
              })}
          </div>
        </div>
        <div className="w-full p-10 flex flex-col gap-2">
          <div>
            {
              categories.length > 0 &&
              categories.map((category) => {
                return(
                  <>
                    <span className="block">{category.categoryName}</span>
                  </>
                );
              })
            }
          </div>
          { (categories.length > 0 && services.length > 0) &&
            services.map(
              (
                {
                  serviceName,
                  price,
                  duration,
                  id,
                  category: { categoryName },
                },
                index
              ) => {
                return (
                  <>
                    <Accordion
                      data-category={categoryName}
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
                        <AccordionContent className="flex gap-6 flex-col">
                          <span className="block">Classic Lashes</span>
                          <span className="block">{price}</span>
                          <span className="block">{duration}</span>
                          <Button>Book</Button>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                );
              }
            )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
