"use server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const createAviability = async (data: OwnerData) => {
  try {
    const createdAt = new Date();
    const response = await client.aviability.create({
      data: {
        ...data,
        createdAt,
        updatedAt: createdAt,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findOperationTimeByDay = async (day: string, userId: string) => {
  try {
    const response = await client.operationTime.findFirst({
      where: {
        user: {
         id: userId,
        },
      },
      select: {
        [day]: true,
      }
    });
    
    return {
      success: true,
      data: response,
    };
  } catch (e) {
    return {
      success: false,
      error: e,
    };
  }
};
