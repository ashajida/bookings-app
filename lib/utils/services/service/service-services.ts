"use server";

import { validateRequest } from "@/lib/validateRequest";
import { PrismaClient, Service } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const client = new PrismaClient();

export const createService = async (data: Record<any, any>) => {
  try {
    const response = await client.service.create({
      data: {
        ...data,
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
          name: username
        }
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

type UpdateServiceData = {
  price: number;
  duration: string;
  serviceName: string;
  description?: string | null;
  id: number;
}

export const updateService = async (data: UpdateServiceData) => {
  try {
    const response = await client.service.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        price: new Decimal(data.price)
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
