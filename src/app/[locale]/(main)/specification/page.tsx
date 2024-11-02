"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import SearchDetail from "@/components/component/search-detail";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Title from "@/components/title";
import PaginationComponant from "@/components/component/pagination";
import ListSpecification from "@/components/component/list-specification";
import { useRouter, useSearchParams } from "next/navigation";

const fetchCarData = async (params: URLSearchParams) => {
  const response = await axios.get(
    `http://localhost:3000/api/car?${params.toString()}`
  );
  return response.data;
};

const SpecificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [formState, setFormState] = React.useState({
    marque: searchParams.get("marque") || "",
    model: searchParams.get("model") || "",
    generation: searchParams.get("generation") || "",
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page") || "1")
      : 1,
  });

  const query = new URLSearchParams(searchParams.toString());

  const {
    data: carData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["carData", query.toString()],
    queryFn: () => fetchCarData(query),
    enabled: true,
    placeholderData: (previousData) => previousData,
  });

  const mutation = useMutation({
    mutationFn: (newFormState: typeof formState) => {
      const params = new URLSearchParams();
      if (newFormState.marque) params.append("marque", newFormState.marque);
      if (newFormState.model) params.append("model", newFormState.model);
      if (newFormState.generation)
        params.append("generation", newFormState.generation);
      params.append("page", newFormState.page.toString());
      return Promise.resolve(
        router.push(`?${params.toString()}`, { scroll: true })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carData"] });
    },
  });

  const updateFormState = React.useCallback(
    (type: string, value: string | number) => {
      setFormState((prev) => {
        const newState = { ...prev, [type]: value };
        if (type === "marque") {
          newState.model = "";
          newState.generation = "";
        } else if (type === "model") {
          newState.generation = "";
        }
        newState.page = type === "page" ? Number(value) : 1;
        mutation.mutate(newState);
        return newState;
      });
    },
    [mutation]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (carData?.pagination?.totalPages || 0)) return;
    updateFormState("page", newPage);
  };

  return (
    <div className="space-y-6  ">
      <Title>Fiche technique</Title>
      <Card className="mb-16">
        <CardContent>
          <div className="grid grid-cols-1 py-4 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SearchDetail
              type="marque"
              placeholder="Marque"
              initialValue={formState.marque}
              onValueChange={(value) => updateFormState("marque", value)}
              parentFormState={formState}
            />
            <SearchDetail
              type="model"
              placeholder="Modèle"
              initialValue={formState.model}
              onValueChange={(value) => updateFormState("model", value)}
              parentFormState={formState}
              disabled={!formState.marque}
            />
            <SearchDetail
              type="generation"
              placeholder="Génération"
              initialValue={formState.generation}
              onValueChange={(value) => updateFormState("generation", value)}
              parentFormState={formState}
              disabled={!formState.model}
            />
          </div>
        </CardContent>
      </Card>

      <div>Résultats : {carData?.pagination?.totalCars || 0}</div>

      <ListSpecification isPending={isLoading} isError={error} data={carData} />

      {carData && carData.data && carData.data.length > 0 && (
        <PaginationComponant
          page={formState.page}
          totalPages={carData.pagination.totalPages}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SpecificationPage;
