"use client";
import { StepOne } from "./step-one";
import { StepTwo } from "./step-two";
import { useMultiContext } from "@/contexts/multistep-form-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

const stepOneSchema = z.object({
  brand: z.string().min(1, { message: "La marque est obligatoire" }),
  model: z.string().min(1, { message: "Le modèle est obligatoire" }),
  motor: z.string().min(1, { message: "La motorisation est obligatoire" }),
  transmission: z
    .string()
    .min(1, { message: "La transmission est obligatoire" }),
  fuel: z.string().min(1, { message: "Le type de carburant est obligatoire" }),
  color: z.string().min(1, { message: "La couleur est obligatoire" }),
  year: z
    .string()
    .min(1)
    .refine(
      (val) => {
        const num = parseInt(val);
        return num >= 1900 && num <= new Date().getFullYear();
      },
      { message: "L'année n'est pas valide" }
    ),
});

const stepTwoSchema = z.object({
  title: z.string().min(1, { message: "Le titre est obligatoire" }),
  description: z.string().min(1, { message: "La description est obligatoire" }),
  price: z
    .string()
    .min(1)
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Le prix doit être positif" }
    ),
  num: z.string().min(1, { message: "Le numéro est obligatoire" }),
  address: z.string().min(1, { message: "L'adresse est obligatoire" }),

  picture: z
    .array(z.string())
    .min(1, { message: "Au moins une photo est requise" }),
});

const formSchema = stepOneSchema.merge(stepTwoSchema);

type FormData = z.infer<typeof formSchema>;

export function MultiForm() {
  const { step, nextStep, prevStep, submitForm, updateFormData } =
    useMultiContext();

  const form = useForm<FormData>({
    resolver: zodResolver(step === 1 ? stepOneSchema : stepTwoSchema),
    defaultValues: {
      brand: "",
      model: "",
      motor: "",
      transmission: "",
      fuel: "",
      color: "",
      year: new Date().getFullYear().toString(),
      title: "",
      description: "",
      price: "",
      num: "",
      address: "",
      picture: [],
    },
  });

  function onSubmit(values: Partial<FormData>) {
    console.log("Fonction onSubmit appelée");
    console.log("Étape actuelle:", step);
    console.log("Valeurs soumises:", values);

    updateFormData(values);

    if (step === 2) {
      submitForm();
    } else {
      nextStep();
    }
  }

  return (
    <Form {...form} aria-label="Formulaire de publication de produit">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4  lg:relative lg:flex-1"
        role="form"
      >
        <FormProvider {...form}>
          {step === 1 && <StepOne />}
          {step === 2 && <StepTwo />}
        </FormProvider>
        <div className="relative bottom-0 left-0 flex w-full justify-between p-4 lg:bottom-0">
          <Button
            type="button"
            variant="outline"
            className={`${step === 1 ? "invisible" : ""}`}
            onClick={() => prevStep()}
          >
            Retour
          </Button>
          <Button type="submit">{step === 2 ? "Confirmer" : "Suivant"}</Button>
        </div>
      </form>
    </Form>
  );
}
