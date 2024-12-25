import { deleteBooking } from "@/lib/repository/booking/booking";

export const deleteBookingAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const bookingId = formData.get("booking-id")?.toString();
  if (!bookingId) return;

  try {
    const result = await deleteBooking(Number(bookingId));

    if (!result) {
      return {
        formError: "An error occured.",
      };
    }

    return {
      formSuccess: "Customer deleted.",
      deletedBooking: result,
    };
  } catch (error) {
    console.log(error);
  }
};
