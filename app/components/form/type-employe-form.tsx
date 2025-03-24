import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { createType, updateType } from "@/app/actions/mainaction";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { EmployesT } from "@/app/(dashbord)/(routes)/type-employes/table/columns";

const typeEmployeSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  description: z.string().min(1, "La description est obligatoire"),
});

type TypeEmployeFormValues = z.infer<typeof typeEmployeSchema>;

const TypeEmployeForm = ({
  openD,
  setOpenD,
  initialData,
  querytypes,
}: // refetch,
{
  openD: boolean;
  setOpenD: (openD: boolean) => void;
  querytypes?: UseQueryResult<any | Error>;
  initialData?: EmployesT | null;
  // refetch: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [errorUnique, setErrorUnique] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<TypeEmployeFormValues>({
    resolver: zodResolver(typeEmployeSchema),
  });

  // console.log(querytypes?.data);

  async function onSubmitModify(data: TypeEmployeFormValues) {
    setIsLoading(true);

    console.log(querytypes);

    await updateType(
      initialData?.id as string,
      data.name,
      data.description
    ).then((res) => {
      if (res.success) {
        querytypes && querytypes.refetch();
        console.log(querytypes);
        setOpenD(false);
        form.reset();
        setIsLoading(false);
        console.log(res);
      }
      if (res.success == false) {
        querytypes && querytypes.refetch();
        setErrorUnique(res.message);
        form.reset();
        console.log(res);
        setIsLoading(false);
      }
    });
  }

  async function onSubmit(data: TypeEmployeFormValues) {
    setIsLoading(true);
    console.log(querytypes);

    await createType(data).then((res) => {
      if (res.success) {
        querytypes && querytypes.refetch();
        setOpenD(false);
        form.reset();
        setIsLoading(false);
      }
      if (res.success == false) {
        querytypes && querytypes.refetch();
        setErrorUnique(res.message);
        form.reset();
        console.log(res);
        setIsLoading(false);
        // setOpenD(false);
      }
    });
  }

  // Pré-remplir le formulaire avec les données initiales
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name as string,
        description: initialData.description as string,
      });
    }
  }, [initialData, form]);
  return (
    <div>
      <form
        onSubmit={
          initialData && initialData.name != ""
            ? form.handleSubmit(onSubmitModify)
            : form.handleSubmit(onSubmit)
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name">Titre</label>
            <input
              id="name"
              type="text"
              placeholder="Titre du type d'employé"
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
            <label htmlFor="email">Description</label>
            <Textarea
              id="description"
              // type="text"
              placeholder="Description du type d'employé"
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

          {error && <p className="text-sm text-red-500">{error}</p>}
          {errorUnique && <p className="text-sm text-red-500">{errorUnique}</p>}

          {initialData && initialData.name != "" ? (
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

export default TypeEmployeForm;
