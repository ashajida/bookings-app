import {
  findUserByEmail,
} from "../utils/services/user/user-services";
import { verify } from "argon2";
import { lucia } from "../auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const login = async (formData: FormData) => {
  "use server";

  const password = formData.get("password")?.toString();
  if (!password) return;

  const email = formData.get("email")?.toString();
  if (!email) return;

  try {
    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      throw new Error("Incorrect Email");
      return;
    }

    const verifyPassword = await verify(existingUser.password, password);

    console.log(verifyPassword)

    if (!verifyPassword) {
      throw new Error("Incorrect Password");
      return;
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
