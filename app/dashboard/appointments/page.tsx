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
import { findAllServices } from "@/lib/repository/service/service";
import { createServiceAction } from "@/lib/actions/services/create-service-action";

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
import { findAllBookings } from "@/lib/repository/booking/booking";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { findAllCustomers } from "@/lib/repository/customer/customer";
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
import { DeleteBookingForm } from "./DeleteBookingForm";
import { ServicesContext } from "@/context/context";
import AddBookingForm from "./AddBookingForm";
import AddCustomerForm from "../customers/AddCustomerForm";
import EditBookingForm from "./EditBookingForm";

const Appointments = () => {
  const [bookings, setBookings] = useState<[]>([]);
  const [open, setOpen] = useState(false);
  const [newServiceDialog, setNewServiceDialog] = useState(false);
  const [newCustomerDialog, setNewCustomerDialog] = useState(false);
  const [customers, setCustomers] = useState<[]>([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const getBookings = async () => {
      const { user } = await validateRequest();
      if (!user) return;

      const response = await findAllBookings(user.id);
      console.log(response, user.id, "response.....");
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
                      <Button onClick={() => {
                        setSelectedBooking(booking)
                        setOpen(!open)
                        }}>Edit</Button>
                      <DeleteBookingForm id={booking.id.toString()} setBookings={setBookings} prevBookings={bookings}/>
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
                <DialogTitle>Add booking</DialogTitle>
                <DialogDescription>
                  Add new booking here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <AddBookingForm setNewCustomerDialog={setNewCustomerDialog} newCustomerDialog={newCustomerDialog} setBookings={setBookings} prevBookings={bookings} />
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit booking</DialogTitle>
                <DialogDescription>
                  Make changes to booking. Click save when you&amp;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <EditBookingForm setBookings={setBookings} prevBookings={bookings} selectedBooking={selectedBooking} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
