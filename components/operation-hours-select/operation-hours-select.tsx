import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Copy, PlusCircle } from "lucide-react";

type Props = {
  opening?: string,
  closing?: string
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
};

const OperationHoursSelect = ({ day, opening, closing }: Props) => {
  const handleCopyTime = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGSVGElement | null;
    if (!target) return;

    const mondayOpeningHr = document.querySelector<HTMLInputElement>(
      'input[name="monday-opening"]'
    );
    const mondayClosingHr = document.querySelector<HTMLInputElement>(
      'input[name="monday-closing"]'
    );

    console.log(mondayClosingHr);

    if (!mondayOpeningHr || !mondayClosingHr) return;

    const openingTimeInputs = document.querySelectorAll<HTMLInputElement>(
      'input[name$="opening"]'
    );
    const closingTimeInputs = document.querySelectorAll<HTMLInputElement>(
      'input[name$="closing"]'
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
        <Input type="time" name={`${day}-opening`} value={opening} />
      </div>
      <div className="flex-1 gap-3">
        <Input type="time" name={`${day}-closing`} value={closing} />
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
