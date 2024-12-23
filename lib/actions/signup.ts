"use server";

import { generateId } from "lucia";
import { createUser } from "../repository/user/user";
import { hash } from "argon2";
import { lucia } from "../auth";
//import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { BaseResponse } from "../utils/types";

type SignupData = {
  businessName: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone: string;
};

export const signup = async ({
  businessName,
  firstName,
  lastName,
  password,
  email,
  phone,
}: SignupData) => {
  const id = generateId(15);
  const passwordHash = await hash(password);
  const data = {
    id: id,
    business: businessName,
    firstName,
    lastName,
    phone,
    email,
    password: passwordHash,
  };

  try {
    const response = await createUser(data);
    console.log(response), "new user......";

    if (!response) {
      return {
        success: false,
        message: "An error has occured.",
      } as BaseResponse;
    }

    const session = await lucia.createSession(id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      message: "User created.",
      data: response,
    } as BaseResponse<typeof response>;

    //return redirect("/");
  } catch (error) {
    return {
      success: false,
      message: "An error has occured",
    } as BaseResponse;
  }
};
