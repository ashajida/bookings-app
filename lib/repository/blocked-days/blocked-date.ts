"use server";

import { validateRequest } from "@/lib/validateRequest";
import { BlockedDate, PrismaClient} from "@prisma/client";

const client = new PrismaClient();

export const createBlockedDate = async ({ date, userId }: { date: Date, userId: string | number}) => {
  try {
    const response = await client.blockedDate.create({
      data: {
        date,
        user: { connect: { id: userId } },
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findBlockedDate = async (id: number) => {
  try {
    const response = await client.blockedDate.findUnique({
      where: {
        id,
      },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const findAllBlockedDates = async (username: string) => {
  try {
    const response = await client.blockedDate.findMany({
      where: {
        user: {
          business: username,
        },
      },
    });
    console.log('working.....')
    console.log(response, 'response....');
    return response;
  } catch (e) {
    console.log(e);
  }
};

