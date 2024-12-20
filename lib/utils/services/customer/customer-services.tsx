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
    console.log(response, "DB......");
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
