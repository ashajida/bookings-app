import { PrismaClient, User } from '@prisma/client'

const client = new PrismaClient();

type CustomerData = {
    firstName: string,
    lastName: string,
    email: string,
    phone: number
}

export const createCustomer = async ({firstName, lastName, email, phone}: CustomerData) => {
    try {
        const response = await client.customer.create({ data: {
            firstName,
            lastName,
            email,
            phone
        } });
        return response;
    } catch(e) {
        console.log(e);
    }
}
