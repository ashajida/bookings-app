"use server";

import { createBooking } from "../utils/services/booking/booking-services";

export type AppointmentData = {
  serviceId: number;
  chosenDate: Date;
  hour: string;
  minutes: string;
  status: string;
  serviceName: string;
  price: string;
  customer?: {
    name: string;
    phone: string;
    email: string;
  };
};

export const submitBookingAction = async (data: AppointmentData) => {
  const { chosenDate, serviceId, status, hour, minutes } = data;
  console.log(chosenDate, "action file......");
  const _date = new Date(chosenDate);

  _date.setHours(parseInt(hour));
  _date.setMinutes(parseInt(minutes));

  try {
    const response = await createBooking({
      serviceId: serviceId,
      status: status,
      date: _date,
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
