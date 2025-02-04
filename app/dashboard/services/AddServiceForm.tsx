import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createServiceAction } from "@/lib/actions/services/create-service-action";

type Props = {
  setServices: Function,
  prevServices: []
}

const AddServiceForm = ({setServices, prevServices}: Props) => {
  const [formState, action, isPending] = useFormState(
    createServiceAction,
    undefined
  );
  const { toast } = useToast();

  useEffect(() => {

    if(formState?.formSuccess) {
      toast({
        title: "Success",
        description: `${formState?.formSuccess}`,
      })
      setServices([...prevServices, formState?.newService]);
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
          name="service-name"
          type="text"
          placeholder="Service Name"
          className="w-full"
        />
        {formState?.serviceName && (
          <span className="text-red-500 text-sm">{formState.serviceName}</span>
        )}
      </div>
      <div>
        <Input
          name="price"
          type="text"
          placeholder="Price"
          className="w-full"
        />
        {formState?.price && (
          <span className="text-red-500 text-sm">{formState.price}</span>
        )}
      </div>
      <div>
        <Input
          name="duration"
          type="text"
          placeholder="Duration"
          className="w-full"
        />
        {formState?.duration && (
          <span className="text-red-500 text-sm">{formState.duration}</span>
        )}
      </div>
      <div>
        <Textarea
          name="description"
          placeholder="Description"
          className="w-full resize-none"
        />
      </div>
      <Button className="w-fit ml-auto">Save</Button>
    </form>
  );
};

export default AddServiceForm;
