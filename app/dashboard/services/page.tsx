"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findAllServices } from "@/lib/utils/services/service/service-services";
import { createServiceAction } from "@/lib/actions/createServiceAction";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Service } from "@prisma/client";
import AddServiceForm from "./AddServiceForm";
import { z } from "zod";
import EditServiceForm from "./EditServiceForm";
import { editServiceAction } from "@/lib/actions/editServiceAction";

type ServicesData = {
  price: string;
  description?: string | null;
  duration: string;
  serviceName: string;
  serviceId: number
};

const Service = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [open, setOpen] = useState(false);
  const [newServiceDialog, setNewServiceDialog] = useState(false);
  const [serviceData, setServiceData] = useState<ServicesData>({});

  useEffect(() => {
    const getServices = async () => {
      const response = await findAllServices();
      if (!response) return;
      setServices(response);
    };

    getServices();

    return () => {
      setServices([]);
    };
  }, []);

  return (
    <div className="container mx-auto">
      <div className="">
        <Button
          variant="outline"
          onClick={() => setNewServiceDialog(!newServiceDialog)}
        >
          Add Service
        </Button>
        {services && (
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map(({ serviceName, price, duration, description, id }) => (
                <TableRow key={serviceName}>
                  <TableCell className="font-medium">{serviceName}</TableCell>
                  <TableCell>{price.toString()}</TableCell>
                  <TableCell>{duration}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      onClick={() => {
                        setOpen(!open);
                        setServiceData({
                          serviceName,
                          price: String(price),
                          duration,
                          description,
                          serviceId: id
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <form>
                      <Button variant="destructive">Delete</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] max-w-[90%] p-8">
          <Dialog open={newServiceDialog} onOpenChange={setNewServiceDialog}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add new service</DialogTitle>
                <DialogDescription>
                  Add a new service here. Click save when you&amp;re done.
                </DialogDescription>
              </DialogHeader>
              <AddServiceForm />
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Service</DialogTitle>
                <DialogDescription>
                  Make changes to your service. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <EditServiceForm serviceData={serviceData} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Service;

const serviceSchema = z.object({
  serviceName: z.string().min(4),
  duration: z.string().min(2),
  price: z.string().min(1),
});

export const handleAddService = async (
  prevState: unknown,
  formData: FormData
) => {
  const serviceData = {
    serviceName: formData.get("service-name")?.toString() || "",
    duration: formData.get("duration")?.toString() || "",
    price: formData.get("price")?.toString() || "",
    description: formData.get("description")?.toString() || "",
  };
  const result = serviceSchema.safeParse(serviceData);

  if (!result.success) {
    const errors = result.error.flatten();
    return {
      serviceName: errors.fieldErrors.serviceName?.[0],
      duration: errors.fieldErrors.duration?.[0],
      price: errors.fieldErrors.price?.[0],
    };
  }

  const response = await createServiceAction(serviceData);

  if (!response?.success) {
    return {
      formError: response?.message,
    };
  }

  return {
    formSuccess: response?.message,
  };
};

export const handleEditService = async (
  prevState: unknown,
  formData: FormData
) => {
  const serviceData = {
    serviceName: formData.get("service-name")?.toString() || "",
    duration: formData.get("duration")?.toString() || "",
    price: formData.get("price")?.toString() || '',
    description: formData.get("description")?.toString() || "",
    serviceId: formData.get('service-id')?.toString() || '',
  };

  console.log(formData.get('serviceId')?.toString(), 'serviceID.....')
  const result = serviceSchema.safeParse(serviceData);

  if (!result.success) {
    const errors = result.error.flatten();
    return {
      serviceName: errors.fieldErrors.serviceName?.[0],
      duration: errors.fieldErrors.duration?.[0],
      price: errors.fieldErrors.price?.[0],
    };
  }

  const response = await editServiceAction(serviceData);

  if (!response?.success) {
    return {
      formError: response?.message,
    };
  }

  return {
    formSuccess: response?.message,
  };
};
