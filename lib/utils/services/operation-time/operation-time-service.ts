import { validateRequest } from "@/lib/validateRequest";
import { OperationTime, PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const createOperationTime = async (data: OperationTime) => {
  const { opening, closing, userId } = data;
  try {
    const response = await client.operationTime.create({
      data: {
        opening,
        closing,
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
