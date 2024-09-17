// app/api/owners/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all owners
export async function GET() {
  try {
    const owners = await prisma.owner.findMany();
    return NextResponse.json(owners, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch owners" }, { status: 500 });
  }
}

// POST create a new owner
export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    const owner = await prisma.owner.create({
      data: {
        name,
        email,
      },
    });
    return NextResponse.json(owner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create owner" }, { status: 500 });
  }
}
