"use client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { TransformIcon } from "@radix-ui/react-icons";
import {
  CalendarIcon,
  Euro,
  EuroIcon,
  FuelIcon,
  GaugeIcon,
  Search,
  Settings,
  X,
} from "lucide-react";
import { DualRangeSlider } from "../ui/dual-range-slider";
const SearchForm = () => {
  const [moreFilters, setMoreFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [mileageMin, setMileageMin] = useState("");
  const [mileageMax, setMileageMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [values, setValues] = useState([0, 100]);

  return (
    <Card className="bg-card max-w-4xl m-auto py-8">
      <CardContent>
        <form>
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 space-y-2">
            <div className="flex w-full max-w-sm m-auto items-center space-x-2">
              <Input
                type="text"
                size={42}
                className="h-14 max-w-full"
                placeholder="Rechercher votre voiture ..."
              />
              <Button
                variant={"default"}
                className="rounded-full w-12 h-12"
                type="submit"
              >
                <Search className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="flex gap-4 py-4">
            {yearMin || yearMax ? (
              <Badge className="group " variant={"outline"}>
                <CalendarIcon className="mr-2 w-4" />
                {yearMin && yearMax
                  ? `${yearMin} à ${yearMax}`
                  : yearMin || yearMax}
                <Button
                  type="button"
                  onClick={() => {
                    setYearMin("");
                    setYearMax("");
                  }}
                  className="rounded-full opacity-0 w-4 h-4 ml-2 group-hover:opacity-100"
                  variant={"destructive"}
                  size={"icon"}
                >
                  <X width={12} />
                </Button>
              </Badge>
            ) : null}

            {mileageMin || mileageMax ? (
              <Badge variant={"outline"}>
                <GaugeIcon className="mr-2 w-4" />
                {mileageMin && mileageMax
                  ? `${mileageMin} klm à ${mileageMax} klm`
                  : mileageMin || mileageMax}
              </Badge>
            ) : null}

            {priceMin || priceMax ? (
              <Badge variant={"outline"}>
                <EuroIcon className="mr-2 w-4" />
                {priceMin && priceMax
                  ? `${priceMin} à ${priceMax}`
                  : priceMin || priceMax}
              </Badge>
            ) : null}

            {fuelType ? (
              <Badge variant={"outline"}>
                <FuelIcon className="mr-2 w-4" />
                {fuelType}
              </Badge>
            ) : null}

            {transmission ? (
              <Badge variant={"outline"}>
                <Settings className="mr-2 w-4" />
                {transmission}
              </Badge>
            ) : null}
          </div>

          {moreFilters ? (
            <div className="grid grid-cols-1 py-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select name="brand" value={brand} onValueChange={setBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="ford">Ford</SelectItem>
                      <SelectItem value="chevrolet">Chevrolet</SelectItem>
                      <SelectItem value="nissan">Nissan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select name="model" value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camry">Camry</SelectItem>
                      <SelectItem value="civic">Civic</SelectItem>
                      <SelectItem value="f150">F-150</SelectItem>
                      <SelectItem value="silverado">Silverado</SelectItem>
                      <SelectItem value="altima">Altima</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-8">
                  <Label htmlFor="year">Année</Label>
                  <DualRangeSlider
                    label={(value) => value}
                    value={values}
                    onValueChange={setValues}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-8">
                  <Label htmlFor="mileage">Kilométrage</Label>
                  <DualRangeSlider
                    label={(value) => value}
                    value={values}
                    onValueChange={setValues}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-8">
                  <Label htmlFor="price">Prix</Label>
                  <DualRangeSlider
                    label={(value) => value}
                    value={values}
                    onValueChange={setValues}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              <div>
                <div className="space-y-2">
                  <Label htmlFor="fuel-type">Fuel Type</Label>
                  <Select
                    name="fuel-type"
                    value={fuelType}
                    onValueChange={setFuelType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select
                    name="transmission"
                    value={transmission}
                    onValueChange={setTransmission}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : null}
          <div className="col-span-1 sm:col-span-2  md:col-span-3 lg:col-span-4 space-y-2">
            <div className="flex items-center">
              <Button
                type="button"
                onClick={() => {
                  setMoreFilters(!moreFilters);
                }}
                variant={"secondary"}
                className="m-auto"
              >
                {!moreFilters ? "Plus de filtre" : "Moins de filtre"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
export default SearchForm;
