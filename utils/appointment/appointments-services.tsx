import { PrismaClient } from '@prisma/client'

const client = new PrismaClient();

export const createAppointment = async (data) => {
    try {
        const response = await client.appointment.create(data);
        return response;
    } catch(e) {
        console.log(e);
    }
}