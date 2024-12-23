// app/api/bookings/route.ts

import { NextResponse } from "next/server";
import {
  createBooking,
  deleteBooking,
} from "@/lib/repository/booking/booking";

// POST create a new booking
export async function POST(req: Request) {
  try {
    const { serviceId, status, date, customer, userId } = await req.json();

    const booking = await createBooking({
      customer: {
        email: customer.email,
      },
      date,
      status,
      serviceId,
      userId,
    });
    return NextResponse.json(
      {
        success: true,
        message: "New service created.",
        data: booking,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// POST create a new booking
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Provide id.",
        },
        { status: 200 }
      );
    }

    const booking = await deleteBooking(Number(id));

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "An error has occured",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking deleted.",
        data: booking,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
