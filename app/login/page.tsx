import { login } from "@/lib/actions/login";
import { validateRequest } from "@/lib/validateRequest";
import { redirect } from "next/navigation";
import React from "react";
import { z } from "zod";
import LoginForm from "./LoginForm";

const Signin = async () => {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <div className="container mx-auto">
      <div className="">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] max-w-[90%] p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7, "Password must be at least 7 characters"),
});

export async function handleLogin(prevState: unknown, formData: FormData) {
  const loginData = {
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };
  const result = userSchema.safeParse(loginData);

  if (!result.success) {
    const errors = result.error.flatten();
    return {
      email: errors.fieldErrors.email?.[0],
      password: errors.fieldErrors.password?.[0],
    };
  }

  const response = await login(loginData);

  if(!response?.success) {
    return {
      formError: response?.message
    }
  }
}

export default Signin;
