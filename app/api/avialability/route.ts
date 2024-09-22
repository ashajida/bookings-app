import { generateTimeSlots } from "@/utils/functions/generateTimeSlots";
import { NextResponse } from "next/server";

// GET all bookings
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const slots = generateTimeSlots(9, 18, 15, [
      {
        time: "13:00",
        duration: 60,
      },
    ]);
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
