"use server";

import { createBooking } from "../utils/services/booking/booking-services";
import { AppointmentData } from "@/app/user/[username]/page";

export const submitBookingAction = async (data: AppointmentData) => {
  const { date, serviceId, status, hour, minutes } = data;
  const _date = new Date(date);

  _date.setHours(parseInt(hour));
  _date.setMinutes(parseInt(minutes));

  try {
    const response = await createBooking({
      service: { connect: { id: serviceId } },
      status: status,
      date: _date,
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
