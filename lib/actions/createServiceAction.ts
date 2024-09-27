"use server";
import { createService } from "../utils/services/service/service-services";
import { findUserById } from "../utils/services/user/user-services";
import { validateRequest } from "../validateRequest";
import { redirect } from "next/navigation";

export const createServiceAction = async (formData: FormData) => {
  try {
    const { user } = await validateRequest();

    if (!user) return;

    const dbUser = await findUserById(user.id);

    const data = {
      serviceName: formData.get("service-name")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      price: parseFloat(formData.get("price")?.toString() ?? "0"),
      duration: formData.get("duration")?.toString() ?? "0",
      user: { connect: { id: user.id } },
    };
    const response = await createService(data);
    if (!response) return;
    redirect("/dashboard/service");
  } catch (error) {
    console.log(error);
  }
};
