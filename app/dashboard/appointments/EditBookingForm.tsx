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
import { format, set } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddCustomerForm from "../customers/AddCustomerForm";
import { findBookingById } from "@/lib/repository/booking/booking";
import { getFilteredTimeSlotsByDate } from "@/lib/services/get-filtered-time-slots-2";
import { getfilteredTimeSlots } from "@/lib/services/get-filtered-time-slots";
import { editBookingAction } from "@/lib/actions/booking/edit-booking-action";

type Props = {
  setBookings: React.Dispatch<React.SetStateAction<[]>>;
  prevBookings: [];
  setNewCustomerDialog: React.Dispatch<React.SetStateAction<boolean>>;
  newCustomerDialog: boolean;
  selectedBooking: {};
};

const EditBookingForm = ({
  setBookings,
  prevBookings,
  setNewCustomerDialog,
  newCustomerDialog,
  selectedBooking,
}: Props) => {
  const [formState, action, isPending] = useFormState(
    editBookingAction,
    undefined
  );
  const { toast } = useToast();

  const [customers, setCustomers] = useState<[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [services, setServices] = useState<[]>([]);
  const [isfetchingTimeSlots, setIsFetchingTimeSlots] = useState(false);
  const [currentTimeSlot, setCurrentTimeSlot] = useState<string>(
    format(selectedBooking.date, "HH:mm")
  );
  const [hasOpened, setHasOpened] = useState(false);

  const handleSelected = async (date?: Date) => {
    if (!date) return;
    setSelectedDate(date);
    try {
      setIsFetchingTimeSlots(true);
      const { user } = await validateRequest();
      if (!user) return;
      const response = await findBookingById(selectedBooking.id);

      if (!response.success && response.data) return;

      setCurrentTimeSlot(format(response.data!.date!, "HH:mm"));

      console.log(
        format(response.data!.date!, "HH:mm"),
        "current time slot...."
      );

      const service = selectedBooking!.service;

      const times = await getFilteredTimeSlotsByDate(date, service, user.id);

      if (!times) return;

      setTimeSlots(times);
    } catch (error) {
      console.log(error, "error....");
    } finally {
      setIsFetchingTimeSlots(false);
    }
  };

  useEffect(() => {
    console.log(formState, "form state-1....");
    if (formState?.formSuccess) {
      toast({
        title: "Success",
        description: `${formState?.formSuccess}`,
      });
      console.log(formState, "form state....");
      const updatedBooking = prevBookings.map((booking) =>
        booking.id === selectedBooking.id ? formState!.booking.data : booking
      );
      console.log(updatedBooking, "updated booking....");
      setBookings(updatedBooking);
      action.reset();
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
    handleSelected(selectedBooking?.date);

    return () => {
      setServices([]);
      setCustomers([]);
    };
  }, [formState?.formSuccess, formState?.formError, toast]);

  return (
    <form className="flex gap-3 flex-col z-[-1]" action={action}>
      <input hidden value={selectedBooking?.id} name="booking-id" />
      <Select
        name="service-id"
        defaultValue={selectedBooking?.service?.id.toString()}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Services" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Services</SelectLabel>
            {services.length &&
              services.map((service, index) => (
                <SelectItem
                  className={`capitalize ${
                    selectedBooking?.service?.id === service.id
                  }`}
                  key={index}
                  value={service.id.toString()}
                  selected={selectedBooking?.service?.id === service.id}
                  data-test={`${selectedBooking?.service?.id === service.id}`}
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
      <Select
        name="time-slot"
        value={currentTimeSlot}
        onValueChange={(e) => {
          setCurrentTimeSlot(e);
          !hasOpened && setHasOpened(true);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Time Slot" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select Time</SelectLabel>

            <SelectItem
              className="capitalize"
              value={format(selectedBooking.date, "HH:mm")}
            >
              {format(selectedBooking.date, "HH:mm")}
            </SelectItem>

            {timeSlots.length ? (
              timeSlots.map((time, index) => {
                if (time === format(selectedBooking.date, "HH:mm")) return;

                return (
                  <SelectItem className="capitalize" key={index} value={time}>
                    {time}
                  </SelectItem>
                );
              })
            ) : (
              <span>No time slots</span>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {formState?.timeSlot && (
        <span className="text-red-500 text-sm">{formState.timeSlot}</span>
      )}
      <Select
        name="customer-id"
        defaultValue={selectedBooking?.customerBookings[0]?.customer.id.toString()}
      >
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
          <AddCustomerForm
            setCustomer={setCustomers}
            prevCustomer={customers}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default EditBookingForm;
