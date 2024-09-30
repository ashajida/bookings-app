"use server";
import { cookies } from "next/headers";
import { lucia } from "./auth";
import { Session } from "lucia";
import { User } from "@prisma/client";

export const validateRequest = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const { session, user } = await lucia.validateSession(sessionId);

  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}

  return {
    session,
    user,
  } as {
    user: User,
    session: Session
  };
};
