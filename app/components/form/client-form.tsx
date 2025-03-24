"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { UseQueryResult } from "@tanstack/react-query";
import { createClient, updateClient } from "@/app/actions/clientaction";
import { postData } from "@/utils/utilts";
// import { createClient, updateClient } from "@/app/actions/clientaction";

const clientSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z
    .string()
    .min(10, "Le numéro doit avoir au moins 10 chiffres")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

const ClientForm = ({
  openD,
  setOpenD,
  initialData,
  queryclients,
}: {
  openD: boolean;
  setOpenD: (openD: boolean) => void;
  queryclients?: UseQueryResult<any, Error>;
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

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
  });

  async function onSubmitModify(data: ClientFormValues) {
    setIsLoading(true);

    // console.log(queryclients);

    updateClient({
      id: initialData?.id as string,
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
    }).then((res) => {
      if (res.success) {
        queryclients?.refetch();
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

  async function onSubmit(data: ClientFormValues) {
    setIsLoading(true);

    postData(data, "/api/clients").then((res) => {
      if (res.success) {
        queryclients?.refetch();
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
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
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
            <label htmlFor="name">Nom complet</label>
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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email du client"
              disabled={isLoading}
              {...form.register("email")}
              className="w-full rounded-md border p-2"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="phoneNumber">Téléphone</label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="Numéro de téléphone"
              disabled={isLoading}
              {...form.register("phone")}
              className="w-full rounded-md border p-2"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="address">Adresse</label>
            <Textarea
              id="address"
              placeholder="Adresse du client"
              disabled={isLoading}
              {...form.register("address")}
              className="w-full rounded-md border p-2"
            />
            {form.formState.errors.address && (
              <p className="text-sm text-red-500">
                {form.formState.errors.address.message}
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

export default ClientForm;
