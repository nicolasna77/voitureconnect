"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "../ui/button";
import useOrientation, { type Orientation } from "@/hooks/useOrientation";

interface ViewToggleProps {
  defaultOrientation: Orientation;
  onChange?: (orientation: Orientation) => void;
}

const ViewToggle = ({ defaultOrientation, onChange }: ViewToggleProps) => {
  const { orientation, updateOrientation } = useOrientation(defaultOrientation);

  const handleOrientationChange = (newOrientation: Orientation) => {
    updateOrientation(newOrientation);
    onChange?.(newOrientation);
  };

  return (
    <div className="flex items-center gap-2">
      {["list", "grid"].map((view) => (
        <Button
          key={view}
          variant="outline"
          size="icon"
          onClick={() => handleOrientationChange(view as Orientation)}
          className={
            orientation === view ? "bg-primary text-primary-foreground" : ""
          }
        >
          {view === "list" ? (
            <List className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
        </Button>
      ))}
    </div>
  );
};

export default ViewToggle;
