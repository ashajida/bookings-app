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

const Service = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [open, setOpen] = useState(false);
  const [newServiceDialog, setNewServiceDialog] = useState(false);

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
        <Button variant="outline" onClick={() => setNewServiceDialog(!newServiceDialog)}>Add Service</Button>
        {services && (
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map(({ serviceName, price, duration }) => (
                <TableRow key={serviceName}>
                  <TableCell className="font-medium">{serviceName}</TableCell>
                  <TableCell>{price.toString()}</TableCell>
                  <TableCell>{duration}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button onClick={() => setOpen(!open)}>Edit</Button>
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
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <form
                className="flex gap-3 flex-col"
                action={createServiceAction}
              >
                <Input
                  name="service-name"
                  type="text"
                  placeholder="Service Name"
                  className="w-full"
                />
                <Input
                  name="description"
                  type="text"
                  placeholder="Description"
                  className="w-full"
                />
                <Input
                  name="price"
                  type="text"
                  placeholder="Price"
                  className="w-full"
                />
                <Input
                  name="duration"
                  type="text"
                  placeholder="Duration"
                  className="w-full"
                />
                <Button variant="outline">Submit</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue="Pedro Duarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    defaultValue="@peduarte"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Service;
