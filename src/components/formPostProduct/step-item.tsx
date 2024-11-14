"use client";
import { useMultiContext } from "@/contexts/multistep-form-context";
import { Button } from "../ui/button";

interface StepItemProps {
  infos: {
    num: number;
    title: string;
    description: string;
  };
}
export function StepItem({ infos }: StepItemProps) {
  const { step } = useMultiContext();
  const isFinished = step === 5 && infos.num === 4;
  return (
    <li className="flex flex-col items-start font-medium">
      <Button
        size="sm"
        variant={step === infos.num || isFinished ? "default" : "outline"}
        className="w-full"
      >
        {infos.description}
      </Button>
    </li>
  );
}
