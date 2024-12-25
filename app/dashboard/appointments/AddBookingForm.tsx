import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { createBookingAction } from "@/lib/actions/booking/create-booking-action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { ServicesContext } from "@/context/context";
import { validateRequest } from "@/lib/validateRequest";
import { getAviability } from "@/lib/http/avialability";
import { findAllCustomers } from "@/lib/repository/customer/customer";
import { findAllServices } from "@/lib/repository/service/service";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddCustomerForm from "../customers/AddCustomerForm";

type Props = {
  setBookings: React.Dispatch<React.SetStateAction<[]>>;
  prevBookings: [];
  setNewCustomerDialog: React.Dispatch<React.SetStateAction<boolean>>;
  newCustomerDialog: boolean;
};

const AddBookingForm = ({ setBookings, prevBookings, setNewCustomerDialog, newCustomerDialog }: Props) => {
  const [formState, action, isPending] = useFormState(
    createBookingAction,
    undefined
  );
  const { toast } = useToast();

  const [customers, setCustomers] = useState<[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [services, setServices] = useState<[]>([]);

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

  useEffect(() => {
    if (formState?.formSuccess) {
      toast({
        title: "Success",
        description: `${formState?.formSuccess}`,
      });
      setBookings([...prevBookings, formState?.newService]);
    }

    if (formState?.formError) {
      toast({
        title: "Failed",
        variant: "destructive",
        description: `${formState?.formError}`,
      });
    }

    const getServices = async () => {
      const { user } = await validateRequest();
      if (!user) return;
      const response = await findAllServices(user.business);
      if (!response) return;
      setServices(response);
    };

    const getCustomers = async () => {
      const { user } = await validateRequest();
      if (!user) return;

      const response = await findAllCustomers(user.id);
      if (!response) return;
      setCustomers(response);
    };

    getServices();
    getCustomers();

    return () => {
      setServices([]);
      setCustomers([]);
    };
  }, [formState?.formSuccess, formState?.formError, toast]);

  return (
    <form className="flex gap-3 flex-col z-[-1]" action={action}>
      <Select name="service-id">
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
      {formState?.service && (
        <span className="text-red-500 text-sm">{formState.service}</span>
      )}
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
              selectedDate ? format(selectedDate, "PPP") : "Pick a date"
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
      <input type="text" hidden value={selectedDate?.toString()} name="date" />
      {formState?.date && (
        <span className="text-red-500 text-sm">{formState.date}</span>
      )}
      <Select name="time-slot">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Time Slot" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select Time</SelectLabel>
            {timeSlots.length ? (
              timeSlots.map((time, index) => (
                <SelectItem className="capitalize" key={index} value={time}>
                  {time}
                </SelectItem>
              ))
            ) : (
              <span>No time slots</span>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {formState?.timeSlot && (
        <span className="text-red-500 text-sm">{formState.timeSlot}</span>
      )}
      <Select name="customer-id">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Customers" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="capitalize">Customers</SelectLabel>
            {customers.length &&
              customers.map((customer, index) => (
                <SelectItem
                  className="capitalize"
                  key={index}
                  value={customer.id.toString()}
                  data-id={customer.id.toString()}
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
      {formState?.timeSlot && (
        <span className="text-red-500 text-sm">{formState.timeSlot}</span>
      )}
      <Button className="w-fit ml-auto">Submit</Button>
      <Dialog open={newCustomerDialog} onOpenChange={setNewCustomerDialog}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Customer</DialogTitle>
              </DialogHeader>
              <AddCustomerForm setCustomer={setCustomers} prevCustomer={customers} />
            </DialogContent>
          </Dialog>
    </form>
  );
};

export default AddBookingForm;
