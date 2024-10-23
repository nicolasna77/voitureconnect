import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";

const FilterSearch = ({
  showFilters,
  setShowFilters,
}: {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const filterContent = (
    <div className="flex flex-col gap-6">
      {[
        {
          title: "Catégorie",
          placeholder: "Voitures",
          items: ["voitures"],
        },
        {
          title: "Marque",
          placeholder: "Tout",
          items: ["tout", "audi", "bmw", "citroen", "fiat"],
        },
        {
          title: "Type de véhicule",
          placeholder: "Tout",
          items: ["tout", "4x4", "suv", "berline", "break", "cabriolet"],
        },
        {
          title: "Carburant",
          placeholder: "Tout",
          items: ["tout", "essence", "diesel", "hybride", "electrique"],
        },
      ].map(({ title, placeholder, items }) => (
        <div key={title}>
          <h3 className="font-semibold mb-2">{title}</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      <div>
        <h3 className="font-semibold mb-2">Prix</h3>
        <div className="flex gap-2">
          <Input type="number" placeholder="Minimum €" />
          <Input type="number" placeholder="Maximum €" />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Année-Modèle</h3>
        <div className="flex gap-2">
          <Input type="number" placeholder="Minimum" />
          <Input type="number" placeholder="Maximum" />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Boîte de vitesse</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox id="manuelle" />
            <label htmlFor="manuelle" className="ml-2">
              Manuelle (468 003)
            </label>
          </div>
          <div className="flex items-center">
            <Checkbox id="automatique" />
            <label htmlFor="automatique" className="ml-2">
              Automatique (369 960)
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Kilométrage</h3>
        <div className="flex gap-2">
          <Input type="number" placeholder="Minimum km" />
          <Input type="number" placeholder="Maximum km" />
        </div>
      </div>

      <Button className="w-full">Rechercher (837 963)</Button>
    </div>
  );

  if (isDesktop) {
    return (
      <Card className="flex flex-col col-span-1 overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <CardTitle className="text-lg">Filtrer</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-md">{filterContent}</CardContent>
      </Card>
    );
  }

  return (
    <Drawer open={showFilters} onOpenChange={setShowFilters}>
      <DrawerContent>
        <div className="p-4 bg-background">
          <h2 className="text-lg font-semibold mb-4">Filtrer</h2>
          {filterContent}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterSearch;
