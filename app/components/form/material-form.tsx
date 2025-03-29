"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UseQueryResult } from "@tanstack/react-query";
import { createMaterial, updateMaterial } from "@/app/actions/materielaction";
import { postData, putData } from "@/utils/utilts";

const materialSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  description: z.string().optional(),
  quantity: z.number().min(1, "La quantité est obligatoire"),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

const MaterialForm = ({
  openD,
  setOpenD,
  initialData,
  querymaterials,
}: {
  openD: boolean;
  setOpenD: (openD: boolean) => void;
  querymaterials?: UseQueryResult<any, Error>;
  initialData?: any | null;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [errorUnique, setErrorUnique] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
  });

  async function onSubmitModify(data: MaterialFormValues) {
    setIsLoading(true);

    putData(data, `/api/materiels/${initialData?.id as string}`).then((res) => {
      if (res.success) {
        querymaterials?.refetch();
        setOpenD(false);
        form.reset();
        setIsLoading(false);
      }
      if (res.success === false) {
        setErrorUnique(res.message);
        setIsLoading(false);
      }
    });
  }

  async function onSubmit(data: MaterialFormValues) {
    try {
      setIsLoading(true);
      const res = await postData(data, "/api/materiels");

      if (res.success) {
        querymaterials?.refetch();
        setOpenD(false);
        form.reset();
        // Vous pouvez ajouter un toast de succès ici si vous avez une bibliothèque de toast
      } else {
        setErrorUnique(res.message || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur lors de la création du matériel:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite"
      );
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description || "",
        quantity: initialData.quantity,
      });
    }
  }, [initialData, form]);

  return (
    <div>
      <form
        onSubmit={
          initialData
            ? form.handleSubmit(onSubmitModify)
            : form.handleSubmit(onSubmit)
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name">Nom</label>
            <input
              id="name"
              type="text"
              placeholder="Nom du material"
              disabled={isLoading}
              {...form.register("name")}
              className="w-full rounded-md border p-2"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="description"
              placeholder="Description"
              disabled={isLoading}
              {...form.register("description")}
              className="w-full rounded-md border p-2"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="quantity">Quantité</label>
            <input
              id="quantity"
              type="number"
              min={0}
              placeholder="Quantité"
              disabled={isLoading}
              {...form.register("quantity", {
                valueAsNumber: true,
                validate: (value) =>
                  !isNaN(value) || "La quantité doit être un nombre",
              })}
              className="w-full rounded-md border p-2"
            />
            {form.formState.errors.quantity && (
              <p className="text-sm text-red-500">
                {form.formState.errors.quantity.message}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {errorUnique && <p className="text-sm text-red-500">{errorUnique}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-black p-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading
              ? "Traitement en cours..."
              : initialData
              ? "Modifier"
              : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialForm;
