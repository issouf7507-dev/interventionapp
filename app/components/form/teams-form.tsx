"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UseQueryResult } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Employes } from "@/app/(dashbord)/(routes)/employes/table/columns";
import { postData, putData } from "@/utils/utilts";

const teamsSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  description: z.string().optional(),
  employeeIds: z.array(z.string()).min(1, "Au moins un employé est requis"),
});

type TeamsFormValues = z.infer<typeof teamsSchema>;

const TeamsForm = ({
  openD,
  setOpenD,
  initialData,
  queryteams,
  employees,
}: {
  openD: boolean;
  setOpenD: (openD: boolean) => void;
  queryteams?: UseQueryResult<any, Error>;
  employees?: UseQueryResult<any, Error>;
  initialData?: any | null;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [errorUnique, setErrorUnique] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<TeamsFormValues>({
    resolver: zodResolver(teamsSchema),
  });

  console.log(initialData);

  async function onSubmitModify(data: TeamsFormValues) {
    setIsLoading(true);
    // console.log(data);

    putData(data, `/api/teams/${initialData.id}`).then((res) => {
      if (res.success) {
        queryteams?.refetch();
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

  async function onSubmit(data: TeamsFormValues) {
    setIsLoading(true);

    postData(data, "/api/teams").then((res) => {
      if (res.success) {
        queryteams?.refetch();
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
        name: initialData?.name,
        description: initialData?.description || "",
        employeeIds: initialData?.employees?.map((el: any) => el.id as string),

        // quantity: initialData.quantity,
      });
    }
  }, [initialData, form]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={
            initialData && initialData.name != ""
              ? form.handleSubmit(onSubmitModify)
              : form.handleSubmit(onSubmit)
          }
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Titre de l'intervention" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description de l'intervention"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Techniciens</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const currentValues = field.value || [];
                    const newValues = currentValues.includes(value)
                      ? currentValues.filter((v) => v !== value)
                      : [...currentValues, value];
                    field.onChange(newValues);
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner des employés" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees &&
                      employees.data?.data?.map((employee: Employes) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {`${employee.firstName} ${employee.lastName}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  {field.value?.map((employeeId) => {
                    const employee =
                      employees &&
                      employees.data?.data?.find(
                        (e: any) => e.id === employeeId
                      );
                    return (
                      <div
                        key={employeeId}
                        className="inline-flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md mr-2 mb-2"
                      >
                        {employee
                          ? `${employee.firstName} ${employee.lastName}`
                          : employeeId}
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => {
                            field.onChange(
                              field.value?.filter((id) => id !== employeeId)
                            );
                            // Si plus aucun employé sélectionné, on reset le Select
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Traitement en cours..." : "Créer l'intervention"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TeamsForm;
