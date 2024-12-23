import { generateTimeSlots } from "@/lib/utils/functions/generateTimeSlots";
import { findAllBlockedDates } from "@/lib/repository/blocked-days/blocked-date";
import { findAllBookings } from "@/lib/repository/booking/booking";
import { findAllOperationTimes } from "@/lib/repository/operation-time/operation-time";
import { NextResponse } from "next/server";

// GET all bookings
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { username, chosenDate } = data as {
      username: string;
      chosenDate: string;
    };

    const _chosenDate = new Date(chosenDate);

    const operationTimes = await findAllOperationTimes(username);
    if (!operationTimes) return;

    let _operationTime: string[] = [];

    const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
      operationTimes;

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
        console.log(days[_chosenDate.getDay()]);
        if (!value) return;
        _operationTime = value.toString().split(",");
      }
    }


    const bookedSlots = await findAllBookings(username, chosenDate);

    const slots = generateTimeSlots(_operationTime[0], _operationTime[1], 15, {
      booked: bookedSlots,
    });
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
