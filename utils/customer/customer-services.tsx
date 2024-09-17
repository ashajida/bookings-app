import { PrismaClient, User } from '@prisma/client'

const client = new PrismaClient();

type UserData = {
    email: string,
    phone: number,
    name: string
}

export const createCustomer = async (data: UserData) => {
    try {
        const createdAt = new Date();
        const response = await client.user.create({ data: {
            ...data, 
            createdAt,
            updatedAt: createdAt
        } });
        return response;
    } catch(e) {
        console.log(e);
    }
}
