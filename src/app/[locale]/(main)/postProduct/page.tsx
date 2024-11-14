import CarDetails from "@/components/component/car-details";
import { MultiForm } from "@/components/formPostProduct/multi-form";
import { Steps } from "@/components/formPostProduct/steps";
import Title from "@/components/title";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import React from "react";

const PagePostProduct = () => {
  return (
    <Card>
      <CardHeader>
        <Title>Déposer une annonce</Title>
        <Steps />
      </CardHeader>
      <CardContent>
        <MultiForm />
      </CardContent>
    </Card>
  );
};

export default PagePostProduct;
