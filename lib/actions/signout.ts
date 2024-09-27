import { redirect } from "next/navigation";
import { lucia } from "../auth";
import { cookies } from "next/headers";

export const signout = async () => {
  "use server";

  try {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    if (!sessionId) return;
    await lucia.invalidateSession(sessionId);
    redirect("/login");
  } catch (error) {
    return {
      success: false,
      errorMessage: error as string,
    };
  }
};
