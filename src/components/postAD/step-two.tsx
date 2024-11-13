"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useMultiContext } from "@/contexts/multistep-form-context";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function StepTwo() {
  const { control } = useFormContext();
  const { updateFormData } = useMultiContext();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre</FormLabel>
            <FormControl>
              <Input
                placeholder="Entrez le titre de l'annonce"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  updateFormData({ title: e.target.value });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez votre véhicule"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  updateFormData({ description: e.target.value });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prix</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Entrez le prix"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  updateFormData({ price: e.target.value });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="num"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de téléphone</FormLabel>
            <FormControl>
              <Input
                placeholder="Entrez votre numéro de téléphone"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  updateFormData({ num: e.target.value });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="picture"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Photos</FormLabel>
            <FormControl>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const fileUrls = files.map((file) =>
                    URL.createObjectURL(file)
                  );
                  field.onChange(fileUrls);
                  updateFormData({ picture: fileUrls });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input
                placeholder="Entrez l'adresse"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  updateFormData({ address: e.target.value });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
