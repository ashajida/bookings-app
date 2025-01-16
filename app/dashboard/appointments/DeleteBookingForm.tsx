import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteBookingAction } from "@/lib/actions/booking/delete-booking-action";
import { useEffect } from "react";
import { useFormState } from "react-dom";

type Props = {
  id: string;
  setBookings: React.Dispatch<React.SetStateAction<[]>>;
  prevBookings: [];
};

export const DeleteBookingForm = ({ setBookings, prevBookings, id }: Props) => {
  const [formState, action, isPending] = useFormState(
    deleteBookingAction,
    undefined
  );

  const { toast } = useToast();

  useEffect(() => {
    if (formState?.formSuccess) {
      toast({
        title: "Success",
        description: `${formState?.formSuccess}`,
      });
      const filteredBookings = prevBookings.filter(
        (filter) => filter.id !== formState?.deletedBooking.id
      );
      setBookings(filteredBookings);
    }

    if (formState?.formError) {
      toast({
        title: "Failed",
        description: `${formState?.formError}`,
      });
    }
  }, [
    formState?.formError,
    formState?.formSuccess,
    toast,
    formState?.deletedBookings,
    setBookings,
  ]);
  return (
    <form action={action}>
      <input name="booking-id" value={id} hidden />
      <Button variant="destructive" disabled={isPending ? true : false}>
        {isPending ? "Loading..." : "Delete"}
      </Button>
    </form>
  );
};
