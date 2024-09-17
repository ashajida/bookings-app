import { PrismaClient, User } from '@prisma/client'

const client = new PrismaClient();

type UserData = {
    email: string,
    phone: number,
    name: string
}

export const createUser = async (data: UserData) => {
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

export const findUser = async (id: number) => {
    try {
        const response = await client.user.findFirst();
        return response;
    } catch (e) {
        console.log(e)
    }
}