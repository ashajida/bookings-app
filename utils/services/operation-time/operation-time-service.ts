import { PrismaClient, OperationTime } from '@prisma/client'

const client = new PrismaClient();

export const createOperationTime = async (data: OperationTime) => {
    try {
        const response = await client.operationTime.create({ data: {
            ...data, 
        }});
        return response;
    } catch(e) {
        console.log(e);
    }
}

export const findOperationTime = async (id: number) => {
    try {
        const response = await client.operationTime.findUnique({
            where: {
                id
            }
        });
        return response;
    } catch (e) {
        console.log(e)
    }
}

export const findAllOperationTimes = async () => {
    try {
        const response = await client.operationTime.findMany();
        return response;
    } catch (e) {
        console.log(e)
    }
}

export const updateOperationTime = async (id: number, data: Partial<OperationTime>) => {
    try {
        const response = await client.operationTime.update({
            where: {
                id
            },
            data: {
                ...data
            }
        });
        return response;
    } catch (e) {
        console.log(e)
    }
}

export const deleteoperationTime = async (id: number) => {
    try {
        const response = await client.operationTime.delete({
            where: {
                id
            }
        });
        return response;
    } catch (e) {
        console.log(e)
    }
}