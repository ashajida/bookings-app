"use server";
import { findUserByEmail } from "../utils/services/user/user-services";
import { verify } from "argon2";
import { lucia } from "../auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BaseResponse } from "../utils/types";

type LoginData = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: LoginData) => {
  try {
    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      return {
        success: false,
        message: "User not found",
      } as BaseResponse;
    }

    const verifyPassword = await verify(existingUser.password, password);

    if (!verifyPassword) {
      return {
        success: false,
        message: "Incorrect Password",
      } as BaseResponse;
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};
