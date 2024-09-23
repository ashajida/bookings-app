"use server";
import { PrismaClient, Service} from '@prisma/client'

const client = new PrismaClient();

export const findAllCategories = async () => {
    try {
        const response = await client.category.findMany({
            where: {
                ownerId: 1
            }
        });
        return response;
    } catch (e) {
        console.log(e)
    }
}