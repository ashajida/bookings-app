import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "@/lib/actions/signup";
import { validateRequest } from "@/lib/validateRequest";
import { redirect } from "next/navigation";
import React from "react";
import { z } from "zod";
import SignupForm from "./SignupForm";

const Signup = async () => {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <div className="container mx-auto">
      <div className="">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] max-w-[90%] p-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7),
  name: z.string().min(4),
  phone: z.string().min(4),
});

export const handleSignup = async (prevState: unknown, formData: FormData) => {
  const signupData = {
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    name: formData.get("name")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
  };
  const result = userSchema.safeParse(signupData);

  console.log(result.success);

  if (!result.success) {
    const errors = result.error.flatten();
    return {
      email: errors.fieldErrors.email?.[0],
      password: errors.fieldErrors.password?.[0],
      name: errors.fieldErrors.name?.[0],
      phone: errors.fieldErrors.phone?.[0],
    };
  }

  const response = await signup(signupData);

  if (!response?.success) {
    return {
      formError: response?.message,
    };
  }
};

export default Signup;
