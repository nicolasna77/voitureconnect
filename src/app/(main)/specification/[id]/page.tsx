"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/table";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { notFound } from "next/navigation";
import React from "react";

async function getGenerationDetails(id: string) {
  const { data } = await axios.get(`/api/car/detail?id=${id}`);
  return data;
}

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

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Une erreur s'est produite</div>;
  if (!generation) return notFound();
  console.log(generation);
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>
          {generation.carModel.carMake.name} {generation.carModel.name}{" "}
          {generation.name}
        </CardTitle>
        <CardDescription>
          Période : {generation.year_begin} - {generation.year_end || "présent"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p>
              <strong>Marque :</strong> {generation.carModel.carMake.name}
            </p>
            <p>
              <strong>Modèle :</strong> {generation.carModel.name}
            </p>
            <p>
              <strong>Génération :</strong> {generation.name}
            </p>
          </div>
          <div>
            <p>
              <strong>Type :</strong> {generation.carType?.name}
            </p>
          </div>
        </div>

        {generation.carSeries.map((series: any) => (
          <Card key={series.id_car_serie} className="mb-4">
            <CardHeader>
              <CardTitle>{series.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {series.carTrims.map((trim: any) => (
                <Accordion key={trim.id_car_trim} type="single" collapsible>
                  <AccordionItem value={trim.id_car_trim.toString()}>
                    <AccordionTrigger>
                      <h3 className="text-lg font-semibold">{trim.name}</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="mb-4">
                        <h4 className="font-semibold">Spécifications</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Spécification</TableHead>
                              <TableHead>Valeur</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {trim.carSpecificationValues.map((spec: any) => (
                              <TableRow key={spec.id_car_specification_value}>
                                <TableCell>
                                  {spec.carSpecification.name}
                                </TableCell>
                                <TableCell>
                                  {spec.value} {spec.unit}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      {trim.carEquipments?.length > 0 ? (
                        trim.carEquipments.map((equipment: any) => (
                          <div
                            key={equipment.id_car_equipment}
                            className="mt-2"
                          >
                            <h4 className="font-semibold">{equipment.name}</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Option</TableHead>
                                  <TableHead>Type</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {equipment.carOptionValues.map(
                                  (optionValue: any) => (
                                    <TableRow
                                      key={optionValue.id_car_option_value}
                                    >
                                      <TableCell>
                                        {optionValue.carOption.name}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          variant={
                                            optionValue.is_base
                                              ? "secondary"
                                              : "default"
                                          }
                                        >
                                          {optionValue.is_base
                                            ? "Base"
                                            : "Option"}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        ))
                      ) : (
                        <div>Aucun équipement disponible</div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
