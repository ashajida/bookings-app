import { validateRequest } from "@/lib/validateRequest";
import { BlockedDate, PrismaClient} from "@prisma/client";

const client = new PrismaClient();

export const createBlockedDate = async (data: BlockedDate) => {
  try {
    const response = await client.blockedDate.create({
      data: {
        ...data,
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

export const findAllBlockedDates= async (username: string) => {
  try {
    const response = await client.blockedDate.findFirst({
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

