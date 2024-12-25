import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteCustomerAction } from "@/lib/actions/customers/delete-customer-action";
import { useEffect } from "react";
import { useFormState } from "react-dom";

type Props = {
    id: string;
    setBookings: React.Dispatch<React.SetStateAction<[]>>;
    prevBookings: []
}
  
export const DeleteBookingForm = ({setBookings, prevBookings, id}: Props ) => {
      const [formState, action, isPending] = useFormState(
        deleteCustomerAction,
        undefined
      );

      const { toast } = useToast();
  
      useEffect(() => {
        if(formState?.formSuccess) {
          toast({
            title: "Success",
            description: `${formState?.formSuccess}`,
          })
          const filteredBookings = prevBookings.filter(filter => filter.id !== formState?.deletedBookings.id)
          setBookings(filteredBookings);
        }
  
        if(formState?.formError) {
          toast({
            title: "Failed",
            description: `${formState?.formError}`,
          })
        }
      }, [formState?.formError, formState?.formSuccess, toast, formState?.deletedBookings, setBookings])
    return(
      <form action={action}>
        <input name="booking-id" value={id} hidden />
        <Button variant="destructive" disabled={isPending ? true : false}>{isPending ? 'Loading...' : 'Delete'}</Button>
      </form>
    );  
  }