"use server";
import { z } from "zod";
import { validateRequest } from "../../validateRequest";
import { createBooking } from "@/lib/repository/booking/booking";

const bookingSchema = z.object({
  date: z.string().min(4),
  timeSlot: z.string().min(4),
  customerId: z.string().min(1),
  serviceId: z.string().min(1),
});

type BookingData = z.infer<typeof bookingSchema>;

export const createBookingWrapper = async ({
  date,
  timeSlot,
  customerId,
  serviceId,
}: BookingData) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return;
    }

    const data = {
      date: new Date(date),
      timeSlot,
      serviceId: Number(serviceId),
      status: "pending",
      customer: {
        id: Number(customerId),
      },
    };

    const result = await createBooking(data);

    if (!result) {
      return;
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const createBookingAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const bookingData = {
    serviceId: formData.get("service-id")?.toString() || "",
    customerId: formData.get("customer-id")?.toString() || "",
    date: formData.get("date")?.toString() || "",
    timeSlot: formData.get("time-slot")?.toString() || "",
  };
  const result = bookingSchema.safeParse(bookingData);

  if (!result.success) {
    const errors = result.error.flatten();
    return {
      date: errors.fieldErrors.date?.[0],
      timeSlot: errors.fieldErrors.timeSlot?.[0],
      customerId: errors.fieldErrors.customerId?.[0],
      serviceId: errors.fieldErrors.serviceId?.[0],
    };
  }

  const response = await createBookingWrapper(bookingData);

  if (!response) {
    return {
      formError: "An error has occured.",
    };
  }

  return {
    formSuccess: "Successfully added new customer.",
    newService: response,
  };
};
