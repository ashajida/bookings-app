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
import { validateRequest } from "@/lib/validateRequest";
import { findAllBookings } from "@/lib/utils/services/booking/booking-services";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const Appointments = () => {
  const [bookings, setBookings] = useState<[]>([]);
  const [open, setOpen] = useState(false);
  const [newServiceDialog, setNewServiceDialog] = useState(false);

  useEffect(() => {
    const getBookings = async () => {
      const { user } = await validateRequest();
      if (!user) return;

      const response = await findAllBookings(user.name);
      if (!response) return;

      setBookings(response);
    };

    getBookings();

    return () => {
      setBookings([]);
    };
  }, []);

  return (
    <div className="container mx-auto">
      <div className="">
        <Button
          variant="outline"
          onClick={() => setNewServiceDialog(!newServiceDialog)}
        >
          Add Appointment
        </Button>
        {bookings && (
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">States</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{1}</TableCell>
                  <TableCell>{}</TableCell>
                  <TableCell>{}</TableCell>
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
                  name="customer-name"
                  type="text"
                  placeholder="Customer Name"
                  className="w-full"
                />
                <Input
                  name="customer-phone"
                  type="tel"
                  placeholder="Phone"
                  className="w-full"
                />
                <Input
                  name="customer-email"
                  type="email"
                  placeholder="Email"
                  className="w-full"
                />
                <hr />
                <Input
                  name="date"
                  type="text"
                  placeholder="Dur"
                  className="w-full"
                />
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Time</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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

export default Appointments;
