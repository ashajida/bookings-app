import { PrismaClient, Owner } from "@prisma/client";

const client = new PrismaClient();

export const createOwner = async (data: Owner) => {
  try {
    const response = await client.owner.create({
      data: {
        ...data,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findOwner = async (id: number) => {
  try {
    const response = await client.owner.findUnique({
      where: {
        id,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findAllOwners = async () => {
  try {
    const response = await client.owner.findMany();
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const updateOwner = async (id: number, data: Partial<Owner>) => {
  try {
    const response = await client.owner.update({
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

export const deleteOwner = async (id: number) => {
  try {
    const response = await client.owner.delete({
      where: {
        id,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};
