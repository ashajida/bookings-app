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
}

export const createOperationTime = async (data: OperationTime, userId: string) => {
  try {
    const response = await client.operationTime.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId
          }
        }
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findOperationTime = async (id: number) => {
  try {
    const response = await client.operationTime.findUnique({
      where: {
        id,
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

export const updateOperationTime = async (
  id: number,
  data: Partial<OperationTime>
) => {
  try {
    const response = await client.operationTime.update({
      where: {
        id,
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
