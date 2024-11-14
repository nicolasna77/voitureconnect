import CarDetails from "@/components/component/car-details";
import { MultiForm } from "@/components/formPostProduct/multi-form";
import { Steps } from "@/components/formPostProduct/steps";
import Title from "@/components/title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React from "react";

const PagePostProduct = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Déposer une annonce</CardTitle>
        <CardDescription>
          Remplissez le formulaire pour déposer votre annonce
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between gap-8 p-4">
        <Steps />
        <MultiForm />
      </CardContent>
    </Card>
  );
};

export default PagePostProduct;
