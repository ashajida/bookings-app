import { Booking, PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const createBooking = async (data: Record<any, any>) => {
  try {
    const response = await client.booking.create({
      data: {
        ...data,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findAllBookings = async (username: string, chosenDate: string) => {
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
        date: {
          gte: startOfDay.toISOString(), // Start of the day in UTC
          lte: endOfDay.toISOString(),
        },
        service: {
          user: {
            name: username,
          },
        },
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
