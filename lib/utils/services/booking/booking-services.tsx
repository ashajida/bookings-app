"use server";

import { Booking, PrismaClient } from "@prisma/client";

const client = new PrismaClient();

type CreateBookingData = {
  date: Date;
  serviceId: number;
  status: string;
  userId: string;
  customer: {
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: number;
  };
};

export const createBooking = async (data: CreateBookingData) => {
  const { serviceId, status, date, customer, userId } = data;

  try {
    let existingCustomer = await client.customer.findUnique({
      where: {
        email: customer.email,
      },
    });

    if (!existingCustomer) {
      existingCustomer = await client.customer.create({
        data: {
          firstName: customer.firstName!,
          lastName: customer.lastName!,
          phone: customer.phone!,
          email: customer.email,
          userId,
        },
      });
    }

    const response = await client.booking.create({
      data: {
        status,
        date: date,
        service: { connect: { id: serviceId } },
        customerBookings: {
          create: [
            {
              customer: {
                connect: { id: existingCustomer.id }, // Ensure this customer exists in the `Customer` table
              },
            },
          ],
        },
      },
      include: {
        customerBookings: {
          include: {
            customer: true,
          },
        },
        service: true,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findAllBookings = async (
  username: string,
  chosenDate: Date = new Date()
) => {
  const date = new Date(chosenDate);

  const startOfDay = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0
  );
  const endOfDay = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    23,
    59,
    59
  );

  try {
    const response = await client.booking.findMany({
      where: {
        // date: {
        //   gte: startOfDay.toISOString(), // Start of the day in UTC
        //   lte: endOfDay.toISOString(),
        // },
        service: {
          user: {
            business: username,
          },
        },
      },
      include: {
        customerBookings: {
          include: {
            customer: true,
          },
        },
        service: true,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findAllBookingsWithoutFilter = async (userId: string) => {
  try {
    const response = await client.booking.findMany({
      where: {
        service: {
          user: {
            business: userId,
          },
        },
      },
      include: {
        customerBookings: true,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findAllBookingByMonth = async (userId: string, date: Date) => {
  try {
    const response = await client.booking.findMany({
      where: {
        data: {},
      },
    });
  } catch (error) {}
};


export const deleteBooking = async (bookingId: number) => {
  try {
    const response = await client.booking.delete({
      where: {
        id: bookingId
      }
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}