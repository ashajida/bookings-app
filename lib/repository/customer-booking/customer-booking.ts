import { PrismaClient, User } from '@prisma/client'

const client = new PrismaClient();

type CustomerBookingData = {
    customerId: number,
    bookingId: number
}

export const createCustomerBooking = async ({customerId, bookingId}: CustomerBookingData) => {
    try {
        const response = await client.customerBooking.create({ data: {
            customer: {
                connect: {
                    id: customerId,
                }
            },
            booking: {
                connect: {
                    id: bookingId,
                }
            }
        } });
        return response;
    } catch(e) {
        console.log(e);
    }
}
