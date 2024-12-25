"use server";

import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

type CustomerData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userId: string;
};

export const createCustomer = async ({
  firstName,
  lastName,
  email,
  phone,
  userId,
}: CustomerData) => {
  try {
    const response = await client.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        userId,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findAllCustomers = async (userId: string) => {
  try {
    const response = await client.customer.findMany({
      where: {
        userId,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};


export const deleteCustomer = async (id: number) => {
  try {
    const response = await client.customer.delete({
      where: {
        id,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const updateCustomer = async (id: number, data: Partial<CustomerData>) => {
  try {
    const response = await client.customer.update({
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


