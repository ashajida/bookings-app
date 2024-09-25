import { generateId } from "lucia";
import { createUser } from "../utils/services/user/user-services";
import { hash } from "@node-rs/argon2";
import { lucia } from "../auth";

export const signup = async (formData: FormData) => {
  "use server";

  //e.preventDefault();

  //const form = e.target as HTMLFormElement;
  //const formData = new FormData(form);

  const password = formData.get('password')?.toString();
  if(!password) return;

    const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });

    const name = formData.get('name')?.toString();
    if(!name) return;

    const phone = formData.get('phone')?.toString();
    if(!phone) return;

    const email = formData.get('email')?.toString();
    if(!name) return;

  const id = generateId(15);


  const data = {
    id: parseInt(id),
    name,
    phone,
    email,
    password: passwordHash
  };


  try {
    const response = await createUser(data);
    const session = await lucia.createSession(id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
