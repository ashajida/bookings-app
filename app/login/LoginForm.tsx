"use client";

import React from "react";
import { handleLogin } from "./page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";

const LoginForm = () => {
  const [errors, action, isPending] = useFormState(handleLogin, undefined);
  return (
    <>
      <form className="flex gap-3 flex-col" action={action}>
        {errors?.formError && (
          <span className="text-red-500">{errors.formError}</span>
        )}
        <div>
          <Input
            type="email"
            placeholder="Email"
            className="w-full"
            name="email"
          />
          {errors?.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>
        <div>
          <Input
            type="password"
            placeholder="password"
            className="w-full"
            name="password"
          />
          {errors?.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>
        <Button disabled={isPending} variant="outline">
          {isPending ? "Loading..." : "Submit"}
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
