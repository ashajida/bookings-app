"use server";

import { PrismaClient, User } from "@prisma/client";

const client = new PrismaClient();

type createUserData = {
  id: string;
  business: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

export const createUser = async (data: createUserData) => {
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

export const findUserByName = async (name: string) => {
  try {
    const response = await client.user.findFirst({
      select: {
        id: true,
        business: true,
      },
      where: {
        business: name,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const response = await client.user.findFirst({
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
