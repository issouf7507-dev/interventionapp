"use client";

import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clients } from "../(dashbord)/(routes)/clients/table/columns";
import { UseQueryResult } from "@tanstack/react-query";
import { Employes } from "../(dashbord)/(routes)/employes/table/columns";
import { Materials } from "../(dashbord)/(routes)/materials/table/columns";
import { createIntervention } from "../actions/interventionaction";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useState } from "react";
import { postData } from "@/utils/utilts";

const interventionFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  location: z.string().min(1, "L'emplacement est requis"),
  startDate: z.date({
    required_error: "La date de début est requise",
  }),
  endDate: z.date({
    required_error: "La date de fin est requise",
  }),
  clientId: z.string().min(1, "Le client est requis"),
  interventionTypeId: z.string().min(1, "Le type d'intervention est requis"),
  employeeIds: z.array(z.string()).min(1, "Au moins un employé est requis"),
  materials: z.array(z.string()).min(1, "Au moins un matériel est requis"),
});

type InterventionFormValues = z.infer<typeof interventionFormSchema>;

interface InterventionFormProps {
  clients: UseQueryResult<any, Error>;
  interventionTypes: UseQueryResult<any, Error>;
  employees: UseQueryResult<any, Error>;
  materials: UseQueryResult<any, Error>;
  queryallinterventions: UseQueryResult<any, Error>;

  openD: boolean;
  setOpenD: (openD: boolean) => void;
}

export function InterventionForm({
  clients: clientQuery,
  interventionTypes,
  employees: employeeQuery,
  materials: materialQuery,
  queryallinterventions,
  openD,
  setOpenD,
}: InterventionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<InterventionFormValues>({
    resolver: zodResolver(interventionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      employeeIds: [],
      materials: [],
    },
  });

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      form.setValue("startDate", date);
    }
  }

  function handleTimeChange(type: "hour" | "minute", value: string) {
    const currentDate = form.getValues("startDate") || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    }

    form.setValue("startDate", newDate);
  }

  function handleDateSelect2(date: Date | undefined) {
    if (date) {
      form.setValue("endDate", date);
    }
  }

  function handleTimeChange2(type: "hour" | "minute", value: string) {
    const currentDate = form.getValues("endDate") || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    }

    form.setValue("endDate", newDate);
  }

  async function onSubmit(data: InterventionFormValues) {
    setIsLoading(true);
    // createIntervention(data)
    postData(data, "/api/interventions").then((res) => {
      queryallinterventions?.refetch();
      form.reset();
      setOpenD(false);
      setIsLoading(false);
    });
    // console.log(queryallinterventions);
  }

  // console.log(employeeQuery.data?.employee);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emplacement</FormLabel>
              <FormControl>
                <Input placeholder="Emplacement" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de début</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MM/dd/yyyy HH:mm")
                        ) : (
                          <span>MM/DD/YYYY HH:mm</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="sm:flex">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                      <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 24 }, (_, i) => i)
                              .reverse()
                              .map((hour) => (
                                <Button
                                  key={hour}
                                  size="icon"
                                  variant={
                                    field.value &&
                                    field.value.getHours() === hour
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleTimeChange("hour", hour.toString())
                                  }
                                >
                                  {hour}
                                </Button>
                              ))}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 12 }, (_, i) => i * 5).map(
                              (minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={
                                    field.value &&
                                    field.value.getMinutes() === minute
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleTimeChange(
                                      "minute",
                                      minute.toString()
                                    )
                                  }
                                >
                                  {minute.toString().padStart(2, "0")}
                                </Button>
                              )
                            )}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de fin</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MM/dd/yyyy HH:mm")
                        ) : (
                          <span>MM/DD/YYYY HH:mm</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="sm:flex">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={handleDateSelect2}
                        initialFocus
                      />
                      <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 24 }, (_, i) => i)
                              .reverse()
                              .map((hour) => (
                                <Button
                                  key={hour}
                                  size="icon"
                                  variant={
                                    field.value &&
                                    field.value.getHours() === hour
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleTimeChange2("hour", hour.toString())
                                  }
                                >
                                  {hour}
                                </Button>
                              ))}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 12 }, (_, i) => i * 5).map(
                              (minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={
                                    field.value &&
                                    field.value.getMinutes() === minute
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleTimeChange2(
                                      "minute",
                                      minute.toString()
                                    )
                                  }
                                >
                                  {minute.toString().padStart(2, "0")}
                                </Button>
                              )
                            )}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                {/* <FormDescription>
                 Please select your preferred date and time.
               </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <FormLabel>Client</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientQuery.data?.data?.map((client: any) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interventionTypeId"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <FormLabel>Type d'intervention</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un type d'intervention" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {interventionTypes.data?.data?.map((type: any) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  {employeeQuery.data?.data?.map((employee: Employes) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {`${employee.firstName} ${employee.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2">
                {field.value?.map((employeeId) => {
                  const employee = employeeQuery.data?.data?.find(
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

        <FormField
          control={form.control}
          name="materials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matériels</FormLabel>
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
                    <SelectValue placeholder="Sélectionner des matériels" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {materialQuery?.data?.data?.map((materiel: Materials) => (
                    <SelectItem key={materiel.id} value={materiel.id}>
                      {`${materiel.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2">
                {field.value?.map((materielId) => {
                  const materiel = materialQuery?.data?.data?.find(
                    (e: any) => e.id === materielId
                  );
                  return (
                    <div
                      key={materielId}
                      className="inline-flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md mr-2 mb-2"
                    >
                      {materiel ? `${materiel.name}` : materielId}
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-4 w-4 p-0 ml-2"
                        onClick={() => {
                          field.onChange(
                            field.value?.filter((id) => id !== materielId)
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
  );
}
