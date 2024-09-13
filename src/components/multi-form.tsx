"use client";
import { StepFour } from "./step-four";
import { StepOne } from "./step-one";
import { StepThree } from "./step-three";
import { StepTwo } from "./step-two";
import { useMultiContext } from "@/contexts/multistep-form-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

const formSchema = z.object({
  marque: z.string().min(1, { message: "La marque est obligatoire" }),
  modele: z.string().min(1, { message: "Le modèle est obligatoire" }),
  motorisation: z
    .string()
    .min(1, { message: "La motorisation est obligatoire" }),
  vehicleTitle: z.string().min(1, { message: "Ce champ est obligatoire" }),
  vehicleDescription: z
    .string()
    .min(1, { message: "Ce champ est obligatoire" }),
  transmissionType: z.string().min(1, { message: "Ce champ est obligatoire" }),
  fuelType: z.string().min(1, { message: "Ce champ est obligatoire" }),
  vehicleColor: z.string().min(1, { message: "Ce champ est obligatoire" }),
  vehiclePhotos: z
    .array(z.string())
    .min(1, { message: "Au moins une photo est requise" }),
  plan: z.string().optional(),
  onlineService: z.boolean().optional(),
  largerStorage: z.boolean().optional(),
  customProfile: z.boolean().optional(),
  userTotal: z.number().optional(),
});

type NewFormData = z.infer<typeof formSchema>;

export function MultiForm() {
  const { step, nextStep, prevStep, createUserData, isYear } =
    useMultiContext();
  const form = useForm<NewFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marque: "",
      modele: "",
      motorisation: "",
      vehicleTitle: "",
      vehicleDescription: "",
      transmissionType: "",
      fuelType: "",
      vehicleColor: "",
      vehiclePhotos: [],
      plan: "",
      onlineService: false,
      largerStorage: false,
      customProfile: false,
      userTotal: 0,
    },
  });

  function onSubmit(values: NewFormData) {
    nextStep();
    let userPlanTotal = 0;
    if (values.plan === "Arcade") {
      userPlanTotal += 9;
    }
    if (values.plan === "Advanced") {
      userPlanTotal += 12;
    }
    if (values.plan === "Pro") {
      userPlanTotal += 15;
    }
    if (values.onlineService) {
      userPlanTotal += 1;
    }
    if (values.largerStorage) {
      userPlanTotal += 2;
    }
    if (values.customProfile) {
      userPlanTotal += 2;
    }
    if (isYear) {
      userPlanTotal *= 10;
    }
    if (values.userTotal !== undefined) {
      values.userTotal += userPlanTotal;
    } else {
      values.userTotal = userPlanTotal;
    }
    if (step === 5) {
      createUserData(values);
    }
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 lg:relative lg:flex-1"
      >
        <FormProvider {...form}>
          {step === 1 && <StepOne />}
          {step === 2 && <StepTwo />}
          {step === 3 && <StepThree />}
          {step === 4 && <StepFour />}
        </FormProvider>
        {step < 6 && (
          <div className="relative bottom-0 left-0 flex w-full justify-between  p-4 lg:bottom-0">
            <Button
              type="button"
              variant={"outline"}
              className={`${step === 1 ? "invisible" : ""}`}
              onClick={() => prevStep()}
            >
              Retour
            </Button>
            <Button type="submit">
              {step === 5 ? "Confirmer" : "Étape suivante"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
