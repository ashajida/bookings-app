import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteServiceAction } from "@/lib/actions/services/delete-service-action";
import { useEffect } from "react";
import { useFormState } from "react-dom";

type Props = {
    id: string
    setServices: Function,
    prevServices: []
}
  
export const DeleteServiceForm = ({setServices, prevServices, id}: Props ) => {
      const [formState, action, isPending] = useFormState(
        deleteServiceAction,
        undefined
      );
  
      const { toast } = useToast();
  
      useEffect(() => {
        if(formState?.formSuccess) {
          toast({
            title: "Success",
            description: `${formState?.formSuccess}`,
          })
          const filteredService = prevServices.filter(filter => filter.id !== formState?.deleteService.id)
          setServices(filteredService);
        }
  
        if(formState?.formError) {
          toast({
            title: "Failed",
            description: `${formState?.formError}`,
          })
        }
      }, [formState?.formError, formState?.formSuccess, toast])
    return(
      <form action={action}>
        <input name="service-id" value={id} hidden />
        <Button variant="destructive" disabled={isPending ? true : false}>{isPending ? 'Loading...' : 'Delete'}</Button>
      </form>
    );  
  }