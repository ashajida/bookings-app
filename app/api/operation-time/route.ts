import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validateRequest";
import {
  createOperationTime,
  findOperationTime,
  updateOperationTime,
} from "@/lib/repository/operation-time/operation-time";

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) return;

    const formData = await req.formData();
    const data = {
      monday:
        formData.get("monday-opening") && formData.get("monday-closing")
          ? `${formData.get("monday-opening")?.toString()},${formData
              .get("monday-closing")
              ?.toString()}`
          : undefined,
      tuesday:
        formData.get("tuesday-opening") && formData.get("tuesday-closing")
          ? `${formData.get("tuesday-opening")?.toString()},${formData
              .get("tuesday-closing")
              ?.toString()}`
          : undefined,
      wednesday:
        formData.get("wednesday-opening") && formData.get("wednesday-closing")
          ? `${formData.get("wednesday-opening")?.toString()},${formData
              .get("wednesday-closing")
              ?.toString()}`
          : undefined,
      thursday:
        formData.get("thursday-opening") && formData.get("thursday-closing")
          ? `${formData.get("thursday-opening")?.toString()},${formData
              .get("thursday-closing")
              ?.toString()}`
          : undefined,
      friday:
        formData.get("friday-opening") && formData.get("friday-closing")
          ? `${formData.get("friday-opening")?.toString()},${formData
              .get("friday-closing")
              ?.toString()}`
          : undefined,
      saturday:
        formData.get("saturday-opening") && formData.get("saturday-closing")
          ? `${formData.get("saturday-opening")?.toString()},${formData
              .get("saturday-closing")
              ?.toString()}`
          : undefined,
      sunday:
        formData.get("sunday-opening") && formData.get("sunday-closing")
          ? `${formData.get("sunday-opening")?.toString()},${formData
              .get("sunday-closing")
              ?.toString()}`
          : undefined,
    };

    const alreadyExists = await findOperationTime(user.id);
    if (alreadyExists) {
      const response = await updateOperationTime(data, user.id);
      return NextResponse.json(response, { status: 201 });
    }

    const response = await createOperationTime(data, user.id);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
