import { generateTimeSlots } from "@/lib/utils/functions/generateTimeSlots";
import { findAllBlockedDates } from "@/lib/repository/blocked-days/blocked-date";
import { findAllBookings, findAllBookingsByDate } from "@/lib/repository/booking/booking";
import { findAllOperationTimes, findOperationTime } from "@/lib/repository/operation-time/operation-time";
import { NextResponse } from "next/server";
import { getDay } from "@/lib/utils/functions/get-day";

// GET all bookings
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, chosenDate } = data as {
      id: string;
      chosenDate: string;
    };

    const _chosenDate = new Date(chosenDate);

    const operationTimes = await findOperationTime(id, getDay(_chosenDate).toLowerCase());
    if (!operationTimes) return;

    console.log(operationTimes, 'operationTimes.....GET');

    let _operationTime: string[] = [];

    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    for (const [key, value] of Object.entries(operationTimes)) {
      if (key === days[_chosenDate.getDay()]) {
        if (!value) return;
        _operationTime = value.toString().split(",");
      }
    }


    const bookedSlots = await findAllBookingsByDate(id, _chosenDate);

    console.log(bookedSlots, _chosenDate, 'bookedSlots.....112');


    const slots = generateTimeSlots(_operationTime[0], _operationTime[1], 15, {
      booked: bookedSlots,
    });

    console.log(_operationTime, 'slots.....11');

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
