"use server";
import { z } from "zod";
import { updateService } from "../../repository/service/service";
import { BaseResponse } from "../../utils/types";
import { validateRequest } from "../../validateRequest";

type ServiceData = {
  price: string;
  description?: string | null;
  duration: string;
  serviceName: string;
  serviceId:  string;
};

const editServiceRepo = async ({
  price,
  serviceName,
  duration,
  description,
  serviceId
}: ServiceData) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return;
    }

    const data = {
      serviceName,
      description,
      price: Number(price),
      duration,
    };
    
    const result = await updateService(Number(serviceId), data);

    if (!result) {
      return;
    }

    return result;

  } catch (error) {
    console.log(error);
  }
};

const serviceSchema = z.object({
  serviceName: z.string().min(4),
  duration: z.string().min(2),
  price: z.string().min(1),
});


export const editServiceAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const serviceData = {
    serviceName: formData.get("service-name")?.toString() || "",
    duration: formData.get("duration")?.toString() || "",
    price: formData.get("price")?.toString() || '',
    description: formData.get("description")?.toString() || "",
    serviceId: formData.get('service-id')?.toString() || '',
  };
  const result = serviceSchema.safeParse(serviceData);

  if (!result.success) {
    const errors = result.error.flatten();
    return {
      serviceName: errors.fieldErrors.serviceName?.[0],
      duration: errors.fieldErrors.duration?.[0],
      price: errors.fieldErrors.price?.[0],
    };
  }

  const response = await editServiceRepo(serviceData);

  if (!response) {
    return {
      formError: 'An error has occured.',
    };
  }

  return {
    formSuccess: 'Successfully added.',
    updatedService: response,
  };
};
