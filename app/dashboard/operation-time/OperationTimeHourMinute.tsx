"use client";
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OperationTimeHourMinute = () => {
  let hours = [] as JSX.Element[];
  let minutes = [] as JSX.Element[];

  useEffect(() => {
    let hIndex = 0;
    let mIndex = 0;

    while (hIndex <= 23) {
      hours.push(
        <SelectItem key={hIndex + 1} value={hIndex.toString()}>
          {hIndex.toString()}
        </SelectItem>
      );
      hIndex++;
    }

    while (mIndex <= 59) {
      minutes.push(
        <SelectItem key={mIndex + 1} value={mIndex.toString()}>
          {mIndex.toString()}
        </SelectItem>
      );
      mIndex++;
    }

    return () => {
      mIndex = 0;
      hIndex = 0;
    };
  }, [hours]);

  return (
    <>
      <div className="mb-3 w-full flex justify-between">
      <Select name="opening-hour">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Hour</SelectLabel>
            {hours}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select name="opening-minute">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Minute" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Minute</SelectLabel>
            {minutes}
          </SelectGroup>
        </SelectContent>
      </Select>
      </div>
      <div className="w-full flex justify-between">
      <Select name="closing-hour">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Hour</SelectLabel>
            {hours}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select name="closing-minute">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Minute" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Minute</SelectLabel>
            {minutes}
          </SelectGroup>
        </SelectContent>
      </Select>
      </div>
    </>
  );
};

export default OperationTimeHourMinute;
