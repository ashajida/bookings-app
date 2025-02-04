import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteCustomerAction } from "@/lib/actions/customers/delete-customer-action";
import { useEffect } from "react";
import { useFormState } from "react-dom";

type Props = {
    id: string;
    setCustomers: React.Dispatch<React.SetStateAction<[]>>;
    prevCustomers: []
}
  
export const DeleteServiceForm = ({setCustomers, prevCustomers, id}: Props ) => {
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
          const filteredCustomers = prevCustomers.filter(filter => filter.id !== formState?.deletedCustomer.id)
          setCustomers(filteredCustomers);
        }
  
        if(formState?.formError) {
          toast({
            title: "Failed",
            description: `${formState?.formError}`,
          })
        }
      }, [formState?.formError, formState?.formSuccess, toast, formState?.deletedCustomer, setCustomers, prevCustomers])
    return(
      <form action={action}>
        <input name="customer-id" value={id} hidden />
        <Button variant="destructive" disabled={isPending ? true : false}>{isPending ? 'Loading...' : 'Delete'}</Button>
      </form>
    );  
  }