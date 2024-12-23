import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { editServiceAction } from "@/lib/actions/services/edit-service-action";

type Props = {
  setServices: Function,
  prevServices: [],
  serviceData: {
    price: string;
    description?: string | null;
    duration: string;
    serviceName: string;
    serviceId: number
  };
};

const EditServiceForm = ({
  setServices,
  prevServices,
  serviceData: { price, serviceName, description, duration, serviceId }
}: Props) => {
  const [formState, action, isPending] = useFormState(
    editServiceAction,
    undefined
  );

  const { toast } = useToast();

  useEffect(() => {

    if(formState?.formSuccess) {
      toast({
        title: "Success",
        description: `${formState?.formSuccess}`,
      })
      const updatedServices = prevServices.map(service => {
        if(service.id === formState?.updatedService.id) {
          return {
            ...service,
            ...formState.updatedService
          }
        }
        return service;
      })
      setServices(updatedServices);
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
      <input type="text" name="service-id" value={serviceId} hidden/>
        <Input
          name="service-name"
          type="text"
          placeholder="Service Name.."
          className="w-full"
          defaultValue={serviceName}
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
          defaultValue={price}
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
          defaultValue={duration}
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

export default EditServiceForm;
