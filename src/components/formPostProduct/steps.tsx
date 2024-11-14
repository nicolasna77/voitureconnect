import React from "react";
import { StepItem } from "./step-item";

const stepData = [
  { num: 1, title: "Step 1", description: "Your Info" },
  { num: 2, title: "Step 2", description: "Select Plan" },
  { num: 3, title: "Step 3", description: "Add-ons" },
  { num: 4, title: "Step 4", description: "Summary" },
];
export function Steps() {
  return (
    <div className="absolute -top-20 left-0 w-full md:w-[25%] md:relative md:top-0 md:left-0">
      <nav className="py-5  bg-background h-full rounded-md border border-border md:p-5">
        <ul className="flex justify-center gap-2 md:flex-col">
          {stepData.map((info, index) => {
            return <StepItem key={index} infos={info} />;
          })}
        </ul>
      </nav>
    </div>
  );
}
