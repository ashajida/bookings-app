import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { handleEditService } from "./page";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  serviceData: {
    price: string;
    description?: string | null;
    duration: string;
    serviceName: string;
    serviceId: number
  };
};

const EditServiceForm = ({
  serviceData: { price, serviceName, description, duration, serviceId },
}: Props) => {
  const [formState, action, isPending] = useFormState(
    handleEditService,
    undefined
  );
  return (
    <form className="flex gap-3 flex-col" action={action}>
      {formState?.formSuccess && (
        <span className="text-green-500">{formState?.formSuccess}</span>
      )}
      {formState?.formError && (
        <span className="text-red-500">{formState?.formError}</span>
      )}
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
