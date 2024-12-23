"use server";

import { validateRequest } from "@/lib/validateRequest";
import { PrismaClient, Service } from "@prisma/client";

const client = new PrismaClient();

export const createService = async (userId: string, data: Record<any, any>) => {
  try {
    const response = await client.service.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findService = async (id: number) => {
  try {
    const response = await client.service.findUnique({
      where: {
        id,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findAllServices = async (username: string) => {
  try {
    const response = await client.service.findMany({
      where: {
        user: {
          business: username,
        },
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const updateService = async (id: number, data: Partial<Service>) => {
  try {
    const response = await client.service.update({
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

export const deleteService = async (id: number) => {
  try {
    const response = await client.service.delete({
      where: {
        id,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
