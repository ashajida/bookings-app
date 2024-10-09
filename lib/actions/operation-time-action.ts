"use server";

import { createOperationTime, findOperationTime, updateOperationTime } from "../utils/services/operation-time/operation-time-service";
import { validateRequest } from "../validateRequest";

export const operationTimeAction = async (formData: FormData) => {
   
    const { user } = await validateRequest();
    if (!user) return;

    const openingHour = formData.get("opening-hour") as string;
    if (!openingHour) return;

    const openingMinute = formData.get("opening-minute") as string;
    if (!openingMinute) return;

    const closingHour = formData.get("closing-hour") as string;
    if (!formData.get("closing-hour")) return;

    const closingMinute = formData.get("closing-minute") as string;
    if (!closingMinute) return;

    const opening = new Date();
    opening.setHours(parseInt(openingHour), parseInt(openingMinute), 0, 0);

    const closing = new Date();
    closing.setHours(parseInt(closingHour), parseInt(closingMinute), 0, 0);

    const data = {
      opening: `${openingHour}:${openingMinute}`,
      closing: `${closingHour}:${closingMinute}`,
      userId: user.id,
    };

    try 

      const response = await createOperationTime(data);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };