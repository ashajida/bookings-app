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
  console.log("response......");

  try {
    const response = await client.operationTime.findUnique({
      where: {
        userId: userId,
      },
      select: {
        [day]: true,
      },
    });
    

    return {
      success: true,
      data: response,
    };
  } catch (e) {
    return {
      success: false,
      error: "An error occurred while fetching operation time",
    };
  }
};
