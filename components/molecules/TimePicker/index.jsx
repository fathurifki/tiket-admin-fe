import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TimePicker = ({ ...props }) => {
  const [time, setTime] = useState({ hours: "", minutes: "" });

  useEffect(() => {
    props.onChange(time);
  }, [time]);

  const handleTimeChange = (name, value) => {
    const formattedValue = value < 10 ? `0${value}` : `${value}`;
    setTime({ ...time, [name]: formattedValue });
  };

  return (
    <div className="mt-2 p-5 w-full bg-white rounded-lg shadow-xl">
      <div className="flex gap-2">
        <Select
          name="hours"
          onValueChange={(value) => handleTimeChange("hours", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Hour" />
          </SelectTrigger>
          <SelectContent className="max-h-[20vh] overflow-auto">
            <SelectGroup className="bg-transparent text-xl appearance-none outline-none mr-4">
              <SelectLabel>Select Hour</SelectLabel>
              {[...Array(24)].map((_, i) => (
                <SelectItem key={i + 1} value={i}>
                  {i < 10 ? `0${i}` : i}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleTimeChange("minutes", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Minute" />
          </SelectTrigger>
          <SelectContent className="max-h-[20vh] overflow-auto">
            <SelectGroup className="bg-transparent text-xl appearance-none outline-none mr-4">
              <SelectLabel>Select Minute</SelectLabel>
              {[...Array(60)].map((_, i) => (
                <SelectItem key={i + 1} value={i}>
                  {i < 10 ? `0${i}` : i}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimePicker;
