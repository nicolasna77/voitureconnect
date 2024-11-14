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
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface FilterState {
  category: string;
  vehicleType: string;
  fuelType: string;
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
  transmission: string;
  kmMin: string;
  kmMax: string;
}

const initialFilters: FilterState = {
  category: "",
  vehicleType: "",
  fuelType: "",
  priceMin: "",
  priceMax: "",
  yearMin: "",
  yearMax: "",
  transmission: "",
  kmMin: "",
  kmMax: "",
};

const FilterSearch = ({
  showFilters,
  setShowFilters,
  onFilterChange,
}: {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onFilterChange: (filters: FilterState) => void;
}) => {
  const isDesktop = useMediaQuery("( min-width:1024px )");
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const { data: filterOptions } = useQuery({
    queryKey: ["filterOptions", searchParams.toString()],
    queryFn: async () => {
      const response = await axios.get(
        `/api/car/filters?${searchParams.toString()}`
      );
      return response.data;
    },
  });

  const handleSearch = useCallback(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const filterContent = useMemo(
    () => (
      <div className="flex flex-col gap-6 ">
        {[
          {
            title: "Carburant",
            key: "fuelType" as keyof FilterState,
            placeholder: "Tout",
            items: filterOptions?.data?.fuelTypes || [],
          },
        ].map(({ title, key, placeholder, items }) => (
          <div key={title}>
            <h3 className="font-semibold mb-2">{title}</h3>
            <Select onValueChange={(value) => handleFilterChange(key, value)}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {items.map((item: string) => (
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
            <Input
              type="number"
              placeholder="Minimum €"
              onChange={(e) => handleFilterChange("priceMin", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Maximum €"
              onChange={(e) => handleFilterChange("priceMax", e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Année-Modèle</h3>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Minimum"
              onChange={(e) => handleFilterChange("yearMin", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Maximum"
              onChange={(e) => handleFilterChange("yearMax", e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Boîte de vitesse</h3>
          <Select
            onValueChange={(value) => handleFilterChange("transmission", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tout type" />
            </SelectTrigger>
            <SelectContent>
              {(filterOptions?.data?.gearboxTypes || []).map((type: string) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {filterOptions?.data?.gearboxCounts?.[type] &&
                    ` (${filterOptions?.data?.gearboxCounts[type]})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Kilométrage</h3>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Minimum km"
              onChange={(e) => handleFilterChange("kmMin", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Maximum km"
              onChange={(e) => handleFilterChange("kmMax", e.target.value)}
            />
          </div>
        </div>

        <Button className="w-full" onClick={handleSearch}>
          Rechercher{" "}
          {filterOptions?.data?.totalCount
            ? `(${filterOptions?.data?.totalCount})`
            : ""}
        </Button>
      </div>
    ),
    [filterOptions?.data, handleFilterChange, handleSearch]
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
