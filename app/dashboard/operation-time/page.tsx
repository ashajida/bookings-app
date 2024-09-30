import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import OperationTimeHourMinute from "./OperationTimeHourMinute";
import { createOperationTime } from "@/lib/utils/services/operation-time/operation-time-service";
import { validateRequest } from "@/lib/validateRequest";
import { operationTimeAction } from "@/lib/actions/operation-time-action";

const OperationTime = () => {

  return (
    <div className="container">
      <div className="grid">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] max-w-[90%] p-8">
          <form className="flex gap-3 flex-col" action={operationTimeAction}>
            <div className="flex flex-wrap gap-3">
                <OperationTimeHourMinute />
            </div>
            <Button variant="outline">Submit</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OperationTime;
