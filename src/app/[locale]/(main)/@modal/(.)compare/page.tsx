"use client";

import { useRouter } from "next/navigation";
import { useCompare } from "@/hooks/use-compare";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompareContent } from "@/components/compare-content";

function ModalHeader() {
  const { clear } = useCompare();

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold">Comparateur</h2>
      <Button variant="outline" size="sm" onClick={clear}>
        Tout effacer
      </Button>
    </div>
  );
}

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
        <CompareContent header={<ModalHeader />} />
      </DialogContent>
    </Dialog>
  );
}
