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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddServiceForm from "./AddServiceForm";
import EditServiceForm from "./EditServiceForm";
import { DeleteServiceForm } from "./DeleteServiceForm";
import { findAllServices } from "@/lib/repository/service/service";
import { validateRequest } from "@/lib/validateRequest";

type ServicesData = {
  price: string;
  description?: string;
  duration: string;
  serviceName: string;
};

const Service = () => {
  const [services, setServices] = useState<[]>([]);
  const [open, setOpen] = useState(false);
  const [newServiceDialog, setNewServiceDialog] = useState(false);
  const [serviceData, setServiceData] = useState<ServicesData>({});

  useEffect(() => {
    const getServices = async () => {
      const { user } = await validateRequest();
        if (!user) return;

      const response = await findAllServices(user.id);
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
                    <DeleteServiceForm setServices={setServices} prevServices={services} id={id} />
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
              <AddServiceForm setServices={setServices} prevServices={services} />
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
              <EditServiceForm setServices={setServices} prevServices={services} serviceData={serviceData} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Service;
