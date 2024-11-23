"use server";
import { createService } from "../utils/services/service/service-services";
import { findUserById } from "../utils/services/user/user-services";
import { BaseResponse } from "../utils/types";
import { validateRequest } from "../validateRequest";
import { redirect } from "next/navigation";

type ServiceData = {
  price: string;
  description: string;
  duration?: string;
  serviceName: string;
};

export const createServiceAction = async ({
  price,
  serviceName,
  duration,
  description,
}: ServiceData) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return {
        success: false,
        message: "Access denied.",
      } as BaseResponse;
    }

    //const dbUser = await findUserById(user.id);

    console.log(price, "price.....");

    const data = {
      serviceName,
      description,
      price: price,
      duration,
      user: { connect: { id: user.id } },
    };
    const response = await createService(data);

    if (!response) {
      return {
        success: false,
        message: "An error has occured.",
      };
    }

    return {
      success: true,
      message: "New Service Added.",
      data: response,
    } as BaseResponse<typeof response>;
    //redirect("/dashboard/service");
  } catch (error) {
    return {
      success: false,
      message: error,
    } as BaseResponse;
  }
};
