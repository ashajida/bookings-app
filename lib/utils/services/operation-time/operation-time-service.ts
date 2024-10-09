"use server";
import { validateRequest } from "@/lib/validateRequest";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

type OperationTime = {
  sunday?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
};

export const createOperationTime = async (
  data: OperationTime,
  userId: string
) => {
  try {
    const response = await client.operationTime.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findOperationTime = async (userId: string) => {
  try {
    const response = await client.operationTime.findUnique({
      where: {
        userId,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findAllOperationTimes = async (username: string) => {
  try {
    const response = await client.operationTime.findFirst({
      where: {
        user: {
          name: username,
        },
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findDaysOff = async (username: string) => {
  const days = ['sunday', 'monday', 'teusday', 'wednesday', 'thursday', 'friday', 'saturday'];
  try {
    const response = await findAllOperationTimes(username);
    if(!response) return;

    const daysOff = days.reduce((prev, current, index) => {
      if (response[current] === null) {
        prev.push(index); 
      }
      return prev; 
    }, []);

    return daysOff;

  } catch(error) {}
}

export const updateOperationTime = async (
  data: Partial<OperationTime>,
  userId: string
) => {
  try {
    const response = await client.operationTime.update({
      where: {
        userId,
      },
      data: {
        ...data,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const deleteoperationTime = async (id: number) => {
  try {
    const response = await client.operationTime.delete({
      where: {
        id,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
