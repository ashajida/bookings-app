"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormState } from "react-dom";
import { handleSignup } from "./page";

const SignupForm = () => {
  const [errors, action, isPending] = useFormState(handleSignup, undefined);
  return (
    <form className="flex gap-3 flex-col" action={action}>
      {errors?.formError && (
        <span className="text-red-500">{errors.formError}</span>
      )}
      <div>
        <Input name="name" type="text" placeholder="Name" className="w-full" />

        {errors?.name && (
          <span className="text-red-500 text-sm">{errors.name}</span>
        )}
      </div>
      <div>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full"
        />
        {errors?.email && (
          <span className="text-red-500 text-sm">{errors.email}</span>
        )}
      </div>
      <div>
        <Input
          name="phone"
          type="phone"
          placeholder="phone"
          className="w-full"
        />
        {errors?.phone && (
          <span className="text-red-500 text-sm">{errors.phone}</span>
        )}
      </div>
      <div>
        <Input
          name="password"
          type="password"
          placeholder="password"
          className="w-full"
        />
        {errors?.password && (
          <span className="text-red-500 text-sm">{errors.password}</span>
        )}
      </div>
      <Button disabled={isPending} variant="outline">
        {isPending ? "Loading..." : "Submit"}
      </Button>
    </form>
  );
};

export default SignupForm;
