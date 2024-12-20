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
        <Input name="business-name" type="text" placeholder="Business Name" className="w-full" />

        {errors?.businessName && (
          <span className="text-red-500 text-sm">{errors.businessName}</span>
        )}
      </div>
      <div>
        <Input name="first-name" type="text" placeholder="First Name" className="w-full" />

        {errors?.firstName && (
          <span className="text-red-500 text-sm">{errors.firstName}</span>
        )}
      </div>
      <div>
        <Input name="last-name" type="text" placeholder="Last Name" className="w-full" />

        {errors?.lastName && (
          <span className="text-red-500 text-sm">{errors.lastName}</span>
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
