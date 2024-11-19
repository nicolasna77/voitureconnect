"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { notFound } from "next/navigation";
import LoaderComponent from "@/components/component/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types
interface Specification {
  name: string;
  value: string;
  unit: string | null;
}

interface CarTrim {
  id_car_trim: number;
  name: string;
  specificationsByCategory: Record<string, Specification[]>;
}

interface CarSerie {
  id_car_serie: number;
  name: string;
  trims: CarTrim[];
  commonSpecifications: Record<string, Specification[]>;
}

interface Generation {
  id_car_generation: number;
  name: string;
  year_begin: string | null;
  year_end: string | null;
  carModel: {
    name: string;
    carMake: {
      name: string;
    };
  };
  series: CarSerie[];
}

// Utilitaires
function getCategoryName(categoryId: string): string {
  const categories: Record<string, string> = {
    chassis: "Châssis",
    engine: "Moteur",
    gearbox: "Boîte de vitesses",
    suspension: "Suspension et freins",
    performance: "Performances",
    other: "Autres spécifications",
  };
  return categories[categoryId] || categoryId;
}

async function getGenerationDetails(id: string): Promise<Generation> {
  const { data } = await axios.get(`/api/car/detail?id=${id}`);
  return data;
}

// Composants
function SpecificationTable({
  specifications,
}: {
  specifications: Specification[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/2">Caractéristique</TableHead>
          <TableHead className="w-1/2">Valeur</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {specifications.map((spec, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{spec.name}</TableCell>
            <TableCell>
              {spec.value} {spec.unit}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function CommonSpecifications({
  specifications,
}: {
  specifications: Record<string, Specification[]>;
}) {
  if (!specifications || Object.keys(specifications).length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Caractéristiques communes</h3>
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(specifications).map(([category, specs]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-lg font-medium">
              {getCategoryName(category)}
            </AccordionTrigger>
            <AccordionContent>
              <SpecificationTable specifications={specs} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function TrimSpecifications({ trims }: { trims: CarTrim[] }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Finitions</h3>
      <Accordion type="single" collapsible className="w-full">
        {trims.map((trim) => (
          <AccordionItem
            key={trim.id_car_trim}
            value={`trim-${trim.id_car_trim}`}
          >
            <AccordionTrigger className="text-lg font-medium">
              {trim.name}
            </AccordionTrigger>
            <AccordionContent>
              {Object.entries(trim.specificationsByCategory || {}).map(
                ([category, specs]) => (
                  <div key={category} className="mb-6">
                    <h4 className="text-lg font-medium mb-2">
                      {getCategoryName(category)}
                    </h4>
                    <SpecificationTable specifications={specs} />
                  </div>
                )
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// Page principale
export default function SpecificationPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    data: generation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["generation", params.id],
    queryFn: () => getGenerationDetails(params.id),
  });

  if (isLoading) return <LoaderComponent />;
  if (isError) return <ErrorComponent />;
  if (!generation) return notFound();

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {generation.carModel?.carMake?.name} {generation.carModel?.name}{" "}
            {generation.name}
          </CardTitle>
          <CardDescription className="text-xl">
            Période : {generation.year_begin || "N/A"} -{" "}
            {generation.year_end || "N/A"}
          </CardDescription>
        </CardHeader>
      </Card>

      {generation.series?.map((serie) => (
        <Card key={serie.id_car_serie} className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              {serie.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CommonSpecifications specifications={serie.commonSpecifications} />
            <TrimSpecifications trims={serie.trims} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorComponent() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-red-600">Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Une erreur s&apos;est produite lors du chargement des données.
            Veuillez réessayer plus tard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
