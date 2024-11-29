"use server";
import { updateService } from "../utils/services/service/service-services";
import { BaseResponse } from "../utils/types";
import { validateRequest } from "../validateRequest";

type ServiceData = {
  price: string;
  description?: string | null;
  duration: string;
  serviceName: string;
  serviceId:  string;
};

export const editServiceAction = async ({
  price,
  serviceName,
  duration,
  description,
  serviceId
}: ServiceData) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return {
        success: false,
        message: "Access denied.",
      } as BaseResponse;
    }

    const data = {
      serviceName,
      description,
      price: Number(price),
      duration,
      id: Number(serviceId)
    };
    const response = await updateService(data);
    console.log(serviceId, 'edit response...')

    if (!response) {
      return {
        success: false,
        message: "An error has occured.",
      };
    }

    return {
      success: true,
      message: "Service updated.",
      data: response,
    } as BaseResponse<typeof response>;
  } catch (error) {
    return {
      success: false,
      message: error,
    } as BaseResponse;
  }
};
