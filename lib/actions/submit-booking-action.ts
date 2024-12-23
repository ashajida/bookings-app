"use server";

import { createBooking } from "../repository/booking/booking";

export type AppointmentData = {
  serviceId: number;
  chosenDate: Date;
  hour: string;
  minutes: string;
  status: string;
  serviceName: string;
  price: string;
  userId: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
};

export const submitBookingAction = async (data: AppointmentData) => {
  const { chosenDate, serviceId, status, hour, minutes, customer, userId } = data;
  const _date = new Date(chosenDate);

  _date.setHours(parseInt(hour));
  _date.setMinutes(parseInt(minutes));

  try {
    const response = await createBooking({
      serviceId: serviceId,
      userId,
      status: status,
      date: _date,
      customer: {
        ...customer,
        phone: Number(customer.phone)
      }
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
