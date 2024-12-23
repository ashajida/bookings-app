"use server";
import { z } from "zod";
import { createService } from "../../repository/service/service";
import { validateRequest } from "../../validateRequest";
import { redirect } from "next/navigation";

type ServiceData = {
  price: string;
  description: string;
  duration?: string;
  serviceName: string;
};

const serviceSchema = z.object({
  serviceName: z.string().min(4),
  duration: z.string().min(2),
  price: z.string().min(1),
});

export const createServiceWrapper = async ({
  price,
  serviceName,
  duration,
  description,
}: ServiceData) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return;
    }

    const data = {
      serviceName,
      description,
      price: price,
      duration,
    };

    const result = await createService(user.id, data);

    if (!result) {
      return;
    }

    return result;

  } catch (error) {
    console.log(error)
  }
};

export const createServiceAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const serviceData = {
    serviceName: formData.get("service-name")?.toString() || "",
    duration: formData.get("duration")?.toString() || "",
    price: formData.get("price")?.toString() || "",
    description: formData.get("description")?.toString() || "",
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

  const response = await createServiceWrapper(serviceData);

  if (!response) {
    return {
      formError: 'An error has occured.',
    };
  }

  return {
    formSuccess: 'Successfully added service.',
    newService: response
  };
};
