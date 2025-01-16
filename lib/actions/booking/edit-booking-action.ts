"use server";
import { updateBooking } from "@/lib/repository/booking/booking";
import { validateRequest } from "@/lib/validateRequest";
import { z } from "zod";

const bookingSchema = z.object({
  date: z.string().min(4),
  timeSlot: z.string().min(4),
  customerId: z.string().min(1),
  serviceId: z.string().min(1),
  bookingId: z.string().min(1),
  status: z.string().min(1),
});

type BookingData = z.infer<typeof bookingSchema>;

export const editBookingWrapper = async (
  { date, serviceId, customerId, status },
  bookingId
) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return;
    }

    const data = {
      date,
      serviceId: Number(serviceId),
      status,
      customerId: Number(customerId),
    };

    const result = await updateBooking(data, Number(bookingId));

    if (!result) {
      return;
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const editBookingAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const bookingData = {
    serviceId: formData.get("service-id")?.toString() || "",
    customerId: formData.get("customer-id")?.toString() || "",
    date: formData.get("date")?.toString() || "",
    timeSlot: formData.get("time-slot")?.toString() || "",
    bookingId: formData.get("booking-id")?.toString() || "",
    status: formData.get("booking-status")?.toString() || "",
  };

  const result = bookingSchema.safeParse(bookingData);
  const _time = bookingData.timeSlot.split(":");
  const _date = new Date(bookingData.date);
  _date.setHours(Number(_time[0]), Number(_time[1]));

  if (!result.success) {
    const errors = result.error.flatten();
    return {
      date: errors.fieldErrors.date?.[0],
      timeSlot: errors.fieldErrors.timeSlot?.[0],
      customerId: errors.fieldErrors.customerId?.[0],
      serviceId: errors.fieldErrors.serviceId?.[0],
      status: errors.fieldErrors.status?.[0],
    };
  }

  const response = await editBookingWrapper(
    {
      serviceId: result.data.serviceId,
      date: _date,
      customerId: result.data.customerId,
      status: result.data.status
    },
    Number(result.data.bookingId)
  );

  if (!response) {
    return {
      formError: "An error has occured.",
      submittedAt: Date.now(),
    };
  }

  return {
    formSuccess: "Successfully updated booking.",
    booking: response,
    submittedAt: Date.now(),
  };
};
