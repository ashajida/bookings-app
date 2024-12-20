"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { FormEvent, useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { findAllCustomers } from "@/lib/utils/services/customer/customer-services";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Form } from "@/components/ui/form";
import { format } from "date-fns";
import { submitBookingAction } from "@/lib/actions/submit-booking-action";
import { createBooking, deleteBooking } from "@/lib/http/booking";
import { createCustomer } from "@/lib/http/customer";
import { getAviability } from "@/lib/http/avialability";

const Appointments = () => {
  const [bookings, setBookings] = useState<[]>([]);
  const [open, setOpen] = useState(false);
  const [newServiceDialog, setNewServiceDialog] = useState(false);
  const [newCustomerDialog, setNewCustomerDialog] = useState(false);
  const [customers, setCustomers] = useState<[]>([]);
  const [services, setServices] = useState<[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const handleSelected = async (date?: Date) => {
    if (!date) return;
    setSelectedDate(date);
    const { user } = await validateRequest();
    if (!user) return;
    const response = await getAviability({
      username: user.business,
      chosenDate: date,
    });
    if (response.success) {
      setTimeSlots(response.data);
    }
  };

  const handleNewCustomer = async (e: Event) => {
    e.preventDefault();

    const { user } = await validateRequest();
    if (!user) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      firstName: formData.get("firstName")?.toString() ?? "",
      lastName: formData.get("lastName")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      userId: user.id,
    };
    const response = await createCustomer(data);
    if (response.success) {
      setCustomers([response.data, ...customers]);
    }
  };

  useEffect(() => {
    const getBookings = async () => {
      const { user } = await validateRequest();
      if (!user) return;

      const response = await findAllBookings(user.business);
      if (!response) return;
      setBookings(response);
    };

    const getCustomers = async () => {
      const { user } = await validateRequest();
      if (!user) return;

      const response = await findAllCustomers(user.id);
      if (!response) return;
      setCustomers(response);
    };

    const getServices = async () => {
      const { user } = await validateRequest();
      if (!user) return;
      const response = await findAllServices(user.business);
      if (!response) return;
      setServices(response);
    };

    getBookings();
    getCustomers();
    getServices();

    return () => {
      setBookings([]);
      setCustomers([]);
      setServices([]);
    };
  }, []);

  const handleSubmitBooking = async (e: Event) => {
    e.preventDefault();

    const { user } = await validateRequest();
    if (!user) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const date = new Date(formData.get("chosenDate")?.toString()!);
    const time = formData.get("timeSlot")?.toString().split(":")!!;
    date.setHours(Number(time[0]));
    date.setMinutes(Number(time[1]));

    const data = {
      serviceId: Number(formData.get("service")?.toString()) ?? "",
      date,
      status: "pending",
      userId: user.id,
      customer: {
        email: formData.get("customer")?.toString() ?? "",
      },
    };
    const response = await createBooking(data);

    setBookings([
      { ...response.data, date: new Date(response.data.date) },
      ...bookings,
    ]);
  };

  const handleDeleteBooking = async (id: string) => {
    const response = await deleteBooking(id);
    if (!response.success) return;
    const updatedBookings = bookings.filter(
      (booking) => booking.id !== response.data.id
    );
    setBookings(updatedBookings);
  };

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
                <TableHead>Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>States</TableHead>
                <TableHead className="text-right">Modify</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking, index) => {
                const formattedTime = new Intl.DateTimeFormat("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false, // 24-hour format
                }).format(booking.date);

                return (
                  <TableRow key={index}>
                    <TableCell>{formattedTime}</TableCell>
                    <TableCell className="font-medium capitalize">
                      {`${booking.customerBookings[0].customer.firstName} ${booking.customerBookings[0].customer.lastName}`}
                    </TableCell>
                    <TableCell>{booking.service.serviceName}</TableCell>
                    <TableCell>{booking.service.duration}</TableCell>
                    <TableCell>
                      <form>
                        <Select>
                          <SelectTrigger className="w-full capitalize">
                            <SelectValue placeholder={booking.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{booking.status}</SelectLabel>
                              <SelectItem value="apple">Approve</SelectItem>
                              <SelectItem value="grapes">Pending</SelectItem>
                              <SelectItem
                                value="banana"
                                className="text-red-500"
                              >
                                Cancelled
                              </SelectItem>
                              <SelectItem value="blueberry">No-show</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </form>
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button onClick={() => setOpen(!open)}>Edit</Button>

                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleDeleteBooking(booking.id.toString())
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
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
                className="flex gap-3 flex-col z-[-1]"
                onSubmit={handleSubmitBooking}
              >
                <Select name="service">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Services</SelectLabel>
                      {services.length &&
                        services.map((service, index) => (
                          <SelectItem
                            className="capitalize"
                            key={index}
                            value={service.id.toString()}
                          >
                            {service.serviceName}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <span>{`${
                        selectedDate
                          ? format(selectedDate, "PPP")
                          : "Pick a date"
                      }`}</span>

                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[1000]" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleSelected}
                    />
                  </PopoverContent>
                </Popover>
                <input
                  type="text"
                  hidden
                  value={selectedDate?.toString()}
                  name="chosenDate"
                />
                <Select name="timeSlot">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Time Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Time</SelectLabel>
                      {timeSlots.length ? (
                        timeSlots.map((time, index) => (
                          <SelectItem
                            className="capitalize"
                            key={index}
                            value={time}
                          >
                            {time}
                          </SelectItem>
                        ))
                      ) : (
                        <span>No time slots</span>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select name="customer">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="capitalize">
                        Customers
                      </SelectLabel>
                      {customers.length &&
                        customers.map((customer, index) => (
                          <SelectItem
                            className="capitalize"
                            key={index}
                            value={customer.email.toString()}
                            data-id={customer.email}
                          >
                            {`${customer.firstName} ${customer.lastName}`}
                          </SelectItem>
                        ))}
                      <Button
                        onClick={() => setNewCustomerDialog(!newCustomerDialog)}
                        className="w-full"
                      >
                        Add customer
                      </Button>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button className="w-fit ml-auto">Submit</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={newCustomerDialog} onOpenChange={setNewCustomerDialog}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Customer</DialogTitle>
              </DialogHeader>
              <form className="grid gap-4 py-4" onSubmit={handleNewCustomer}>
                <Input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  className="w-full"
                />
                <Input
                  name="lastName"
                  type="text"
                  placeholder="First Name"
                  className="w-full"
                />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="phone"
                  className="w-full"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full"
                />
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&amp;re
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
