"use server";

import { updateBookingStatus } from "@/lib/repository/booking/booking";

export const bookingStatusAction = async (
  prevState: unknown,
  formData: FormData
) => {
  console.log(formData, "formData");
  const bookingId = formData.get("booking-id")!.toString();
  const status = formData.get("booking-status")!.toString();

  try {
    const response = await updateBookingStatus(status, Number(bookingId));
    console.log('action', response)
    if (!response.success) {
      return {
        formError: 'An error has occured',
      };
    }

    return {
      formSuccess: 'Successfully updated booking status',
      response,
      submittedAt: Date.now(),
    };
  } catch (error) {
    console.log(error);
  }
};
