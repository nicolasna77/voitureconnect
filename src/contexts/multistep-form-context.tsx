"use client";
import { ReactNode, createContext, useContext, useState } from "react";

export interface FormData {
  brand: string;
  model: string;
  motor: string;
  transmission: string;
  fuel: string;
  color: string;
  year: string;
  title: string;
  description: string;
  price: string;
  num: string;
  address: string;
  picture: string[];
}

interface MultiStepContextType {
  data: FormData;
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (partialData: Partial<FormData>) => void;
  submitForm: () => void;
}

export const MultiStepContext = createContext({} as MultiStepContextType);

interface MultiStepContextProviderProps {
  children: ReactNode;
}

export function MultiStepContextProvider({
  children,
}: MultiStepContextProviderProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({
    brand: "",
    model: "",
    motor: "",
    transmission: "",
    fuel: "",
    color: "",
    year: "",
    title: "",
    description: "",
    price: "",
    num: "",
    address: "",
    picture: [],
  });

  function updateFormData(partialData: Partial<FormData>) {
    setData((prevData) => ({ ...prevData, ...partialData }));
    console.log("Données du formulaire mises à jour:", data);
  }

  function nextStep() {
    setStep((prevStep) => {
      const newStep = prevStep < 4 ? prevStep + 1 : prevStep;
      console.log("Étape suivante:", newStep);
      return newStep;
    });
  }

  function prevStep() {
    setStep((prevStep) => {
      const newStep = prevStep > 1 ? prevStep - 1 : prevStep;
      console.log("Étape précédente:", newStep);
      return newStep;
    });
  }

  function submitForm() {
    console.log("Formulaire soumis:", data);
    // Ici, vous pouvez ajouter la logique pour envoyer les données au serveur
  }

  return (
    <MultiStepContext.Provider
      value={{
        data,
        step,
        nextStep,
        prevStep,
        updateFormData,
        submitForm,
      }}
    >
      {children}
    </MultiStepContext.Provider>
  );
}

export const useMultiContext = () => useContext(MultiStepContext);
