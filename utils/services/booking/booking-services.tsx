import { PrismaClient } from '@prisma/client'

const client = new PrismaClient();

export const createBooking = async () => {
    try {
        const response = await client.booking.create();
        return response;
    } catch(e) {
        console.log(e);
    }
}