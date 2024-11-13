"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function StepOne() {
  const { control } = useFormContext();
  return (
    <>
      <FormField
        control={control}
        name="brand" // Correction du nom de la propriété
        render={({ field: { onChange, value, ref } }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              Marque
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une marque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Ford">Ford</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="model" // Correction du nom de la propriété
        render={({ field: { onChange, value, ref } }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              Modèle
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un modèle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Corolla">Corolla</SelectItem>
                  <SelectItem value="Civic">Civic</SelectItem>
                  <SelectItem value="Mustang">Mustang</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="fuel" // Correction du nom de la propriété
        render={({ field: { onChange, value, ref } }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              Carburant
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de carburant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Essence">Essence</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Électrique">Électrique</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="motor" // Correction du nom de la propriété
        render={({ field: { onChange, value, ref } }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              Motorisation
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une motorisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hybride">Hybride</SelectItem>
                  <SelectItem value="Électrique">Électrique</SelectItem>
                  <SelectItem value="Thermique">Thermique</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="transmission" // Correction du nom de la propriété
        render={({ field: { onChange, value, ref } }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              Boîte de vitesse
              <FormMessage />
            </FormLabel>
            <FormControl>
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automatique">Automatique</SelectItem>
                  <SelectItem value="Manuel">Manuel</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
