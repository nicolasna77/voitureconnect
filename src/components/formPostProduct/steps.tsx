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
    <header className="flex h-[200px]  items-start justify-center bg-sidebarMobile bg-cover bg-no-repeat p-6 lg:row-span-3 lg:row-start-2  lg:justify-start lg:rounded-md lg:bg-sidebarDesktop lg:bg-cover lg:bg-center lg:pt-10">
      <div className="flex gap-4 text-white m-auto">
        {stepData.map((info, index) => {
          return <StepItem key={index} infos={info} />;
        })}
      </div>
    </header>
  );
}
