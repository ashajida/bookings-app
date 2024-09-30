import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/login";
import { validateRequest } from "@/lib/validateRequest";
import { redirect } from "next/navigation";
import React from "react";

const Signin = async () => {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <div className="container mx-auto">
      <div className="">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] max-w-[90%] p-8">
          <form className="flex gap-3 flex-col" action={login}>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full"
            />
            <Input
              name="password"
              type="password"
              placeholder="password"
              className="w-full"
            />
            <Button variant="outline">Submit</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
