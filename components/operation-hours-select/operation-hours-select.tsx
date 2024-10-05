import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type Props = {
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
}

const OperationHoursSelect = ({ day }: Props) => {
  return (
    <div className="flex flex-row gap-3 align-middle">
      <div className="flex-1 flex-col flex justify-center">
        <Label className="mb-3 block">{day}</Label>
      </div>
      <div className="flex-1 gap-3">
        <Input type="time" name={`${day}-monday-opening-time`} />
      </div>
      <div className="flex-1 gap-3">
        <Input type="time" name={`${day}-tuesday-closing-time`} />
      </div>
    </div>
  );
};

export default OperationHoursSelect;
