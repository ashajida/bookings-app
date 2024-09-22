import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import OperationTimeHourMinute from "./OperationTimeHourMinute";
import { createOperationTime } from "@/utils/services/operation-time/operation-time-service";

const OperationTime = () => {

  const handleSubmit = async (formData: FormData) => {
    "use server";

    const openingHour = formData.get('opening-hour') as string;
    if(!openingHour) return;

    const openingMinute = formData.get('opening-minute') as string;
    if(!openingMinute) return;

    const closingHour = formData.get('closing-hour') as string;
    if(!formData.get('closing-hour')) return;

    const closingMinute = formData.get('closing-minute') as string
    if(!closingMinute) return;
    
    const opening = new Date();
    opening.setHours(parseInt(openingHour), parseInt(openingMinute), 0, 0)

    const closing = new Date()
    closing.setHours(parseInt(closingHour), parseInt(closingMinute), 0, 0)

    const data = {
        opening, 
        closing,
        ownerId: 1,
    }

    try {
        const response = await createOperationTime(data)
        console.log(response)
        return response;
    } catch (error) {
        console.log(error)
    }

  }

  return (
    <div className="container">
      <div className="grid">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] max-w-[90%] p-8">
          <form className="flex gap-3 flex-col" action={handleSubmit}>
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
