import { generateTimeSlots } from "@/lib/utils/functions/generateTimeSlots";
import { findAllBookings } from "@/lib/utils/services/booking/booking-services";
import { findAllOperationTimes } from "@/lib/utils/services/operation-time/operation-time-service";
import { NextResponse } from "next/server";

// GET all bookings
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { username, chosenDate } = data as {
      username: string;
      chosenDate: string;
    };
    console.log(data);

    const operationTimes = await findAllOperationTimes(username);
    if (!operationTimes) return;

    const { opening, closing } = operationTimes;

    const _openDate = new Date(opening);
    const _closingDate = new Date(closing);
    //const _chosenDate = new Date(chosenDate);

    const bookedSlots = await findAllBookings(username, chosenDate);

    console.log(new Date(chosenDate));

    const slots = generateTimeSlots(
      _openDate,
      _closingDate,
      15,
      bookedSlots?.length ? bookedSlots : undefined
    );
    return NextResponse.json(
      {
        success: true,
        message: "Hello World",
        data: slots,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
  }
}
