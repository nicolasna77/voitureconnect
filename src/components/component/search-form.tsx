"use client";
import { Input } from "../ui/input";
import * as React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Command,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const marques = [
  {
    value: "toyota",
    label: "Toyota",
  },
  {
    value: "honda",
    label: "Honda",
  },
  {
    value: "ford",
    label: "Ford",
  },
  {
    value: "chevrolet",
    label: "Chevrolet",
  },
  {
    value: "nissan",
    label: "Nissan",
  },
];

const models = [
  {
    value: "camry",
    label: "Camry",
  },
  {
    value: "civic",
    label: "Civic",
  },
  {
    value: "f150",
    label: "F-150",
  },
  {
    value: "silverado",
    label: "Silverado",
  },
  {
    value: "altima",
    label: "Altima",
  },
];

const moteurs = [
  {
    value: "electric",
    label: "Electric",
  },
  {
    value: "diesel",
    label: "Diesel",
  },
  {
    value: "hybrid",
    label: "Hybrid",
  },
];

const versions = [
  {
    value: "v1",
    label: "Version 1",
  },
  {
    value: "v2",
    label: "Version 2",
  },
  {
    value: "v3",
    label: "Version 3",
  },
];

const SearchForm = () => {
  const [openMarque, setOpenMarque] = React.useState(false);
  const [openModel, setOpenModel] = React.useState(false);
  const [openMoteur, setOpenMoteur] = React.useState(false);
  const [openVersion, setOpenVersion] = React.useState(false);
  const [valueMarque, setValueMarque] = React.useState("");
  const [valueModel, setValueModel] = React.useState("");
  const [valueMoteur, setValueMoteur] = React.useState("");
  const [valueVersion, setValueVersion] = React.useState("");
  const [valueInput, setValueInput] = React.useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = new URLSearchParams({
      q: valueInput,
      marque: valueMarque,
      model: valueModel,
      version: valueVersion,
      moteur: valueMoteur,
    }).toString();
    router.push(`/search?${query}`);
  };

  return (
    <Card className="bg-border max-w-2xl m-auto py-8">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="m-auto flex justify-center">
            <div className="relative ">
              <Input
                type="text"
                size={65}
                name="search"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                className="h-14 peer max-w-lg pl-10 bg-white"
                placeholder="Rechercher votre voiture ..."
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="flex m-auto w-full align-middle justify-center">
            <div className="space-y-2">
              <Popover open={openMarque} onOpenChange={setOpenMarque}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openMarque}
                    className=" justify-between rounded-l-full rounded-r-none"
                    size={"lg"}
                  >
                    {valueMarque
                      ? marques.find((marque) => marque.value === valueMarque)
                          ?.label
                      : "Marque"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className=" p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search marque..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No marque found.</CommandEmpty>
                      <CommandGroup>
                        {marques.map((marque) => (
                          <CommandItem
                            key={marque.value}
                            value={marque.value}
                            onSelect={(currentValue) => {
                              setValueMarque(
                                currentValue === valueMarque ? "" : currentValue
                              );
                              setOpenMarque(false);
                            }}
                          >
                            {marque.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                valueMarque === marque.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Popover open={openVersion} onOpenChange={setOpenVersion}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openVersion}
                    size={"lg"}
                    className="justify-between rounded-none"
                  >
                    {valueVersion
                      ? versions.find(
                          (version) => version.value === valueVersion
                        )?.label
                      : "Version"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className=" p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search version..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No version found.</CommandEmpty>
                      <CommandGroup>
                        {versions.map((version) => (
                          <CommandItem
                            key={version.value}
                            value={version.value}
                            onSelect={(currentValue) => {
                              setValueVersion(
                                currentValue === valueVersion
                                  ? ""
                                  : currentValue
                              );
                              setOpenVersion(false);
                            }}
                          >
                            {version.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                valueVersion === version.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Popover open={openModel} onOpenChange={setOpenModel}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openModel}
                    size={"lg"}
                    className=" justify-between rounded-none"
                  >
                    {valueModel
                      ? models.find((model) => model.value === valueModel)
                          ?.label
                      : "Model"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className=" p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search model..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No model found.</CommandEmpty>
                      <CommandGroup>
                        {models.map((model) => (
                          <CommandItem
                            key={model.value}
                            value={model.value}
                            onSelect={(currentValue) => {
                              setValueModel(
                                currentValue === valueModel ? "" : currentValue
                              );
                              setOpenModel(false);
                            }}
                          >
                            {model.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                valueModel === model.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Popover open={openMoteur} onOpenChange={setOpenMoteur}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    size={"lg"}
                    aria-expanded={openMoteur}
                    className=" justify-between rounded-l-none rounded-r-full"
                  >
                    {valueMoteur
                      ? moteurs.find((moteur) => moteur.value === valueMoteur)
                          ?.label
                      : "Moteur"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[150px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search moteur..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No moteur found.</CommandEmpty>
                      <CommandGroup>
                        {moteurs.map((moteur) => (
                          <CommandItem
                            key={moteur.value}
                            value={moteur.value}
                            onSelect={(currentValue) => {
                              setValueMoteur(
                                currentValue === valueMoteur ? "" : currentValue
                              );
                              setOpenMoteur(false);
                            }}
                          >
                            {moteur.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                valueMoteur === moteur.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Button type="submit" variant="default" size="lg">
              Rechercher
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
export default SearchForm;
