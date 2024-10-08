import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Copy, PlusCircle } from "lucide-react";

type Props = {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
};

const OperationHoursSelect = ({ day }: Props) => {
  const handleCopyTime = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGSVGElement | null;
    if (!target) return;

    const mondayOpeningHr = document.querySelector<HTMLInputElement>(
      'input[name="monday-opening-time"]'
    );
    const mondayClosingHr = document.querySelector<HTMLInputElement>(
      'input[name="monday-closing-time"]'
    );

    console.log(mondayClosingHr);

    if (!mondayOpeningHr || !mondayClosingHr) return;

    const openingTimeInputs = document.querySelectorAll<HTMLInputElement>(
      'input[name$="opening-time"]'
    );
    const closingTimeInputs = document.querySelectorAll<HTMLInputElement>(
      'input[name$="closing-time"]'
    );

    openingTimeInputs.forEach((input) => {
      input.value = mondayOpeningHr.value;
    });

    closingTimeInputs.forEach((input) => {
      input.value = mondayClosingHr.value;
    });
  };
  return (
    <div className="flex flex-row gap-3 align-middle w-full">
      <div className="flex-1 flex-col flex justify-center min-w-[68px]">
        <Label className="mb-3 block capitalize">{day}</Label>
      </div>
      <div className="flex-1 gap-3">
        <Input type="time" name={`${day}-opening`} />
      </div>
      <div className="flex-1 gap-3">
        <Input type="time" name={`${day}-closing`} />
      </div>
      <div className="flex-1 gap-3">
        <PlusCircle className="pointer-cursor" />
      </div>
      <div className="flex-1 gap-3">
        {day === "monday" && (
          <Copy onClick={handleCopyTime} className="pointer-cursor" />
        )}
      </div>
    </div>
  );
};

export default OperationHoursSelect;
