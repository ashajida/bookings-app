import { PrismaClient, User } from "@prisma/client";

const client = new PrismaClient();

export const createUser = async (data) => {
  try {
    const response = await client.user.create({
      data: {
        ...data,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findUserById = async (id: string) => {
  try {
    const response = await client.user.findUnique({
      where: {
        id,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const response = await client.user.findUnique({
      where: {
        email,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findAllUsers = async () => {
  try {
    const response = await client.user.findMany();
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const updateUser = async (id: string, data: Partial<User>) => {
  try {
    const response = await client.user.update({
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

export const deleteUser = async (id: number) => {
  try {
    const response = await client.user.delete({
      where: {
        id,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
