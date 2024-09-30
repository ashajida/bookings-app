"use server";

import { createBooking } from "../utils/services/booking/booking-services";
import { AppointmentData } from "@/app/user/[username]/page";

export const submitBookingAction = async (data: AppointmentData) => {
  console.log('action pack.......................')
  const { chosenDate, serviceId, status, hour, minutes } = data;
  console.log(chosenDate, 'action file......')
  const _date = new Date(chosenDate);

  _date.setHours(parseInt(hour));
  _date.setMinutes(parseInt(minutes));

  try {
    const response = await createBooking({
      serviceId:  serviceId ,
      status: status,
      date: _date,
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
