import { createCustomer } from "@/lib/repository/customer/customer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, userId } = await request.json();

    const customer = await createCustomer({
      firstName,
      lastName,
      email,
      phone,
      userId,
    });

    console.log(customer, 'route..');

    if(!customer) {
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
        message: "Customer Created",
        data: customer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
}
