// app/components/form/employee-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
// import { createEmployee, updateEmployee } from "@/app/actions/mainaction";
import { UseQueryResult } from "@tanstack/react-query";
// import { EmployeeT } from "@/app/(dashbord)/(routes)/employees/table/columns";
import { useQuery } from "@tanstack/react-query";
import { getAllTypes } from "@/app/actions/mainaction";
import { createEmployee, updateEmployee } from "@/app/actions/employeaction";
import { Employes } from "@/app/(dashbord)/(routes)/employes/table/columns";
import { useSession } from "next-auth/react";

const employeeSchema = z.object({
  firstName: z.string().min(1, "Le prénom est obligatoire"),
  lastName: z.string().min(1, "Le nom est obligatoire"),
  email: z.string().email("Email invalide").optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  employeeTypeId: z.string().min(1, "Le type d'employé est obligatoire"),
  // userId: z.string(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

const EmployeeForm = ({
  openD,
  setOpenD,
  initialData,
  queryemployees,
}: {
  openD: boolean;
  setOpenD: (openD: boolean) => void;
  queryemployees?: UseQueryResult<any, Error>;
  initialData?: Employes | null;
  // initialData?: any | null;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [errorUnique, setErrorUnique] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status: sessionStatus } = useSession();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  const { data: typesData } = useQuery({
    queryKey: ["querytypes"],
    queryFn: getAllTypes,
  });

  //   console.log(typesData);

  async function onSubmitModify(data: EmployeeFormValues) {
    setIsLoading(true);
    // console.log(initialData?.id as string);
    updateEmployee(
      initialData?.id as string,
      data.firstName,
      data.lastName,
      data.email || undefined,
      data.phoneNumber || undefined,
      data.address || undefined,
      data.employeeTypeId
    ).then((res) => {
      if (res.success) {
        queryemployees && queryemployees.refetch();
        setOpenD(false);
        form.reset();
        setIsLoading(false);
      }
    });
  }

  async function onSubmit(data: EmployeeFormValues) {
    setIsLoading(true);

    await createEmployee({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || undefined,
      phoneNumber: data.phoneNumber || undefined,
      address: data.address || undefined,
      employeeTypeId: data.employeeTypeId,
      userId: session?.user?.id as string,
    }).then((res) => {
      if (res.success) {
        queryemployees && queryemployees.refetch();
        setOpenD(false);
        form.reset();
        setIsLoading(false);
        console.log(res.message);
      }
      if (res.success === false) {
        // setErrorUnique(res.message);
        console.log(res.message);

        setIsLoading(false);
      }
    });
  }

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        firstName: initialData.firstName as string,
        lastName: initialData.lastName as string,
        email: initialData.email as string,
        phoneNumber: initialData.phoneNumber as string,
        address: initialData.address as string,
        employeeTypeId: initialData.employeeTypeId as string,
      });
    }
  }, [initialData, form]);

  return (
    <div>
      <form
        onSubmit={
          initialData && initialData.firstName != ""
            ? form.handleSubmit(onSubmitModify)
            : form.handleSubmit(onSubmit)
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="firstName">Prénom</label>
            <input
              id="firstName"
              type="text"
              placeholder="Prénom de l'employé"
              disabled={isLoading}
              {...form.register("firstName")}
              className="w-full rounded-md border p-2"
            />
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-500">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="lastName">Nom</label>
            <input
              id="lastName"
              type="text"
              placeholder="Nom de l'employé"
              disabled={isLoading}
              {...form.register("lastName")}
              className="w-full rounded-md border p-2"
            />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-500">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email de l'employé"
              disabled={
                isLoading || Boolean(initialData && initialData.firstName != "")
              }
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
              disabled={
                isLoading || Boolean(initialData && initialData.firstName != "")
              }
              {...form.register("phoneNumber")}
              className="w-full rounded-md border p-2"
            />
            {form.formState.errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {form.formState.errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="address">Adresse</label>
            <Textarea
              id="address"
              placeholder="Adresse de l'employé"
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

          <div className="grid gap-2">
            <label htmlFor="employeeTypeId">Type d'employé</label>
            <select
              id="employeeTypeId"
              disabled={isLoading}
              {...form.register("employeeTypeId")}
              className="w-full rounded-md border p-2"
            >
              <option value="">Sélectionnez un type</option>
              {typesData?.types?.map((type: any) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {form.formState.errors.employeeTypeId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.employeeTypeId.message}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {errorUnique && <p className="text-sm text-red-500">{errorUnique}</p>}

          {initialData && initialData.firstName != "" ? (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-black p-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? "Tache en cours..." : "Modifier"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-black p-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? "Tache en cours..." : "Valider"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
