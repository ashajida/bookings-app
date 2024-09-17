// app/api/bookings/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all bookings
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        availability: true,
        service: true,
      },
    });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST create a new booking
export async function POST(req: Request) {
  try {
    const { customerId, availabilityId, serviceId } = await req.json();
    const booking = await prisma.booking.create({
      data: {
        customerId,
        availabilityId,
        serviceId,
        bookingDate: new Date(),
      },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
