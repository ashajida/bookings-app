import { generateId } from "lucia";
import { createUser } from "../utils/services/user/user-services";
import { hash } from "argon2";
import { lucia } from "../auth";
//import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const signup = async (formData: FormData) => {
  "use server";

  const password = formData.get("password")?.toString();
  if (!password) return;

  const passwordHash = await hash(password);

  const name = formData.get("name")?.toString();
  if (!name) return;

  const phone = formData.get("phone")?.toString();
  if (!phone) return;

  const email = formData.get("email")?.toString();
  if (!email) return;

  const id = generateId(15);

  const data = {
    id: id,
    name,
    phone,
    email,
    password: passwordHash,
  };

  try {
    const response = await createUser(data);
    console.log(response);

    const session = await lucia.createSession(id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    //return redirect("/");
  } catch (error) {
    console.log(error);
  }
};
