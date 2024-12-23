"use server";
import { z } from "zod";
import { validateRequest } from "../../validateRequest";
import { createCustomer } from "@/lib/repository/customer/customer";

const customerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(4),
  lastName: z.string().min(4),
  phone: z.string().min(7),
});

type CustomerData = z.infer<typeof customerSchema>;

export const createServiceWrapper = async ({
  firstName,
  lastName,
  phone,
  email,
}: CustomerData) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return;
    }

    const data = {
        firstName,
        lastName,
        email,
        phone,
        userId: user.id,
    };

    const result = await createCustomer(data);

    if (!result) {
      return;
    }

    return result;

  } catch (error) {
    console.log(error)
  }
};

export const createCustomerAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const serviceData = {
    firstName: formData.get("first-name")?.toString() || "",
    lastName: formData.get("last-name")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    email: formData.get("email")?.toString() || "",
  };
  const result = customerSchema.safeParse(serviceData);

  if (!result.success) {
    const errors = result.error.flatten();
    return {
      firstName: errors.fieldErrors.firstName?.[0],
      lastName: errors.fieldErrors.lastName?.[0],
      phone: errors.fieldErrors.phone?.[0],
      email: errors.fieldErrors.email?.[0],
    };
  }

  const response = await createServiceWrapper(serviceData);

  if (!response) {
    return {
      formError: 'An error has occured.',
    };
  }

  return {
    formSuccess: 'Successfully added new customer.',
    newService: response
  };
};
