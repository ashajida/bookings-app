import { signout } from "@/lib/actions/signout";
import React from "react";

const Signout = () => {
  return (
    <>
      <form action={signout}>
        <button>Sign out</button>
      </form>
    </>
  );
};

export default Signout;
