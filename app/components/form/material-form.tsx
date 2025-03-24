"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UseQueryResult } from "@tanstack/react-query";
import { createMaterial, updateMaterial } from "@/app/actions/materielaction";

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

  const cities = [
    "Abidjan",
    "Yamoussoukro",
    "Bouaké",
    "Daloa",
    "San-Pédro",
    "Korhogo",
    "Man",
    "Gagnoa",
    // Ajoutez d'autres villes selon vos besoins
  ];

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
  });

  async function onSubmitModify(data: MaterialFormValues) {
    setIsLoading(true);
    console.log(querymaterials);
    updateMaterial({
      id: initialData?.id as string,
      name: data.name,
      description: data.description || "",
      quantity: data.quantity,
    }).then((res) => {
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
    setIsLoading(true);

    // console.log(data);

    await createMaterial({
      name: data.name,
      description: data.description || "",
      quantity: data.quantity,
    }).then((res) => {
      if (res.success) {
        querymaterials?.refetch();
        setOpenD(false);
        form.reset();
        setIsLoading(false);
      } else {
        setErrorUnique(res.message);
        setIsLoading(false);
      }
    });
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
              placeholder="Nom du client"
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
