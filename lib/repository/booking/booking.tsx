"use server";

import { Booking, PrismaClient } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";

const client = new PrismaClient();

type CreateBookingData = {
  date: Date;
  serviceId: number;
  status: string;
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: number;
    id?: number;
  };
};

/**
 *
 * @param data
 * @returns
 */
export const createBooking = async (data: CreateBookingData) => {
  const { serviceId, status, date, customer } = data;

  try {
    let existingCustomer = await client.customer.findUnique({
      where: {
        id: customer.id,
      },
    });

    if (!existingCustomer) {
      existingCustomer = await client.customer.create({
        data: {
          firstName: customer.firstName!,
          lastName: customer.lastName!,
          phone: customer.phone!,
          email: customer.email,
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
  id: string,
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
        service: {
          user: {
            id,
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
        id: bookingId,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const findAllBookingsByDate = async (
  id: string,
  date: Date = new Date()
) => {
  //const date = new Date(chosenDate);

  const startOfDayUTC = startOfDay(date);
const endOfDayUTC = endOfDay(date);

  try {
    const response = await client.booking.findMany({
      where: {
        date: {
          gte: startOfDayUTC,
          lte: endOfDayUTC,
        },
        service: {
          user: {
            id,
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


export const findBookingById = async (id: number) => {
  try {
    const booking = await client.booking.findUnique({
      where: {
        id,
      },
      include: {
        customerBookings: {
          include: {
            customer: true,
          },
        },
        service: true,
      }
    });
    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    console.log(error);
  }
}


export const findBookingByDate = async (date: Date, userId: string) => {
  const startDate = startOfDay(date); // e.g., 2025-01-07T00:00:00.000Z
  const endDate = endOfDay(date); 

  try {
    const booking = await client.booking.findMany({
      where: {
        date : {
          gte: startDate,
          lte: endDate
        },
        service: {
          userId
        }
      },
    });
    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    console.log(error);
  }
}

type Booking = {
  date: Date;
  serviceId: number;
  status: string;
  customerId: number;
}

export const updateBooking = async (data: Partial<Booking>, bookingId: number) => { 
  const {customerId, ...filteredData} = data;
  try {
    const booking = await client.booking.update({
      where: {
        id: bookingId
      },
      data: {
        ...filteredData
      },
      include: {
        customerBookings: {
          include: {
            customer: true,
          },
        },
        service: true,
      }
    });

    if(!booking) {
      return {
        success: false,
        error: 'Booking not found'
      }
    }

    const customerBooking = await updateCustomerBooking(customerId!, booking.customerBookings[0].id);


    const updatedBooking = await findBookingById(bookingId);    

    return {
      success: true,
      data: updatedBooking,
    };

  } catch (error) {
    return {
      success: false,
      error: error
    }
  }
}


const updateCustomerBooking = async (customerId: number, customerBookingId: number) => {
  try {
    const response = await client.customerBooking.update({
      where: {
        id: customerBookingId
      },
      data: {
        customerId: customerId
      }
    })
    return {
      success: true,
      data: response
    }
  } catch (e) {
    return {
      success: false,
      error: e
    }
  }
}

export const updateBookingStatus = async (status: string, bookingId: number) => {
  try {
    const response = await client.booking.update({
      where: {
        id: bookingId
      },
      data: {
        status
      }
    })
    return {
      success: true,
      data: response
    }
  } catch (e) {
    return {
      success: false,
      error: e
    }
  }
}