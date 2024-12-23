import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createServiceAction } from "@/lib/actions/services/create-service-action";
import { createCustomerAction } from "@/lib/actions/customers/create-customer-action";

type Props = {
  setCustomer: Function,
  prevCustomer: []
}

const AddServiceForm = ({setCustomer, prevCustomer}: Props) => {
  const [formState, action, isPending] = useFormState(
    createCustomerAction,
    undefined
  );
  const { toast } = useToast();

  useEffect(() => {

    if(formState?.formSuccess) {
      toast({
        title: "Success",
        description: `${formState?.formSuccess}`,
      })
      setCustomer([...prevCustomer, formState?.newService]);
    }

    if(formState?.formError) {
      toast({
        title: "Failed",
        variant: 'destructive',
        description: `${formState?.formError}`,
      })
    }


  }, [formState?.formSuccess, formState?.formError, toast]);
  return (
    <form className="flex gap-3 flex-col" action={action}>
      <div>
        <Input
          name="first-name"
          type="text"
          placeholder="First Name"
          className="w-full"
        />
        {formState?.firstName && (
          <span className="text-red-500 text-sm">{formState.firstName}</span>
        )}
      </div>
      <div>
        <Input
          name="last-name"
          type="text"
          placeholder="Last Name"
          className="w-full"
        />
        {formState?.lastName && (
          <span className="text-red-500 text-sm">{formState.lastName}</span>
        )}
      </div>
      <div>
        <Input
          name="phone"
          type="tel"
          placeholder="Phone"
          className="w-full"
        />
        {formState?.phone && (
          <span className="text-red-500 text-sm">{formState.phone}</span>
        )}
      </div>
      <div>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full"
        />
        {formState?.email && (
          <span className="text-red-500 text-sm">{formState.email}</span>
        )}
      </div>
      <Button className="w-fit ml-auto">Save</Button>
    </form>
  );
};

export default AddServiceForm;
