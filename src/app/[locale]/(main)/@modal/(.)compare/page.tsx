"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompareContent } from "@/components/compare-content";

export default function CompareModal() {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto overscroll-contain p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>Comparateur de véhicules</DialogTitle>
        </DialogHeader>
        <CompareContent isModal />
      </DialogContent>
    </Dialog>
  );
}
