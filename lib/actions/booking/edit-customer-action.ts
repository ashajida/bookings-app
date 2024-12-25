"use server";
import { z } from "zod";
import { updateCustomer } from "@/lib/repository/customer/customer";

const customerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(4),
  lastName: z.string().min(4),
  phone: z.string().min(7),
});

type CustomerData = z.infer<typeof customerSchema>;

const editCustomersRepo = async (
  customerId: number,
  { firstName, lastName, phone, email }: CustomerData
) => {
  try {
    const data = {
      firstName,
      lastName,
      phone,
      email,
    };

    const result = await updateCustomer(Number(customerId), data);

    if (!result) {
      return;
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const editCustomerAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const customersData = {
    firstName: formData.get("first-name")?.toString() || "",
    lastName: formData.get("last-name")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    email: formData.get("email")?.toString() || "",
  };
  const result = customerSchema.safeParse(customersData);

  const customerId = formData.get("customer-id")?.toString();

  if (!result.success) {
    const errors = result.error.flatten();
    return {
      firstName: errors.fieldErrors.firstName?.[0],
      lastName: errors.fieldErrors.lastName?.[0],
      phone: errors.fieldErrors.phone?.[0],
      email: errors.fieldErrors.email?.[0],
    };
  }

  const response = await editCustomersRepo(Number(customerId!), customersData);

  if (!response) {
    return {
      formError: "An error has occured.",
    };
  }

  return {
    formSuccess: "Successfully added.",
    updatedCustomer: response,
  };
};
