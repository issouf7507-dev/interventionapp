"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icons } from "./icons";
import { Intervention } from "@prisma/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boolean, string, z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { uploadInterventionImages } from "../actions/interventionaction";
import { UseQueryResult } from "@tanstack/react-query";
import { putData } from "@/utils/utilts";
import { useEdgeStore } from "../lib/s";
import { FileState, MultiImageDropzone } from "./_comp/MultiImageDropzone";

// import { uploadInterventionImages } from "@/app/actions/interventionaction";

// Type pour le résultat de uploadInterventionImages

// // Composant toast simple
// type ToastProps = {
//   title?: string;
//   description?: string;
//   variant?: "default" | "destructive";
// };

const updateStateSchema = z.object({
  interventionId: z.string(),
  type: z.string(),
  description: z.string().min(1, "La description est requise"),
  conclusion: z.string().optional(),
  states: z.array(z.string()).optional(),
});

type UpdateStateFormValues = z.infer<typeof updateStateSchema>;

export function EtatIntervention({
  intervention,
  openUpdate,
  setOpenUpdate,
  queryAllInterventions,
}: {
  // intervention: Intervention;
  intervention: any;
  openUpdate: boolean;
  setOpenUpdate: (openUpdate: boolean) => void;
  queryAllInterventions: UseQueryResult<any, Error>;
}) {
  const [stateType, setStateType] = useState<"BEFORE" | "AFTER">(
    intervention.status == "PENDING" ? "BEFORE" : "AFTER"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const urls: string[] = [];

  const form = useForm<UpdateStateFormValues>({
    resolver: zodResolver(updateStateSchema),
    defaultValues: {
      interventionId: intervention.id,
      type: "BEFORE",
      description: "",
      conclusion: "",
    },
  });

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  const onSubmit = async (data: UpdateStateFormValues) => {
    await Promise.all(
      fileStates.map(async (addedFileState) => {
        try {
          const res = await edgestore.publicFiles.upload({
            file: addedFileState.file,
            onProgressChange: async (progress: any) => {
              updateFileProgress(addedFileState.key, progress);
              if (progress === 100) {
                // wait 1 second to set it to complete
                // so that the user can see the progress bar at 100%
                await new Promise((resolve) => setTimeout(resolve, 1000));
                updateFileProgress(addedFileState.key, "COMPLETE");
              }
            },
          });

          urls.push(res?.url);
          console.log(urls);
        } catch (err) {
          updateFileProgress(addedFileState.key, "ERROR");
        }
      })
    );

    if (stateType === "BEFORE" && urls.length > 0) {
      const state = {
        ...data,
        state: urls,
        type: "BEFORE",
      };

      await putData(state, `/api/interventions/${intervention.id}`).then(
        (res) => {
          if (res.success) {
            queryAllInterventions.refetch();
            setOpenUpdate(false);
            form.reset();
          }
        }
      );
    }

    if (stateType === "AFTER" && urls.length > 0) {
      const state = {
        ...data,
        state: urls,
        type: "AFTER",
      };

      await putData(state, `/api/interventions/${intervention.id}`).then(
        (res) => {
          if (res.success) {
            queryAllInterventions.refetch();
            setOpenUpdate(false);
            form.reset();
          }
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <RadioGroup
        defaultValue={stateType}
        className="grid grid-cols-2 gap-4"
        onValueChange={(value) => {
          setStateType(value as "BEFORE" | "AFTER");
          form.setValue("type", stateType);
        }}
      >
        <div>
          <RadioGroupItem
            value="BEFORE"
            id="before"
            className="peer sr-only"
            disabled={intervention.status === "IN_PROGRESS"}
          />
          <Label
            htmlFor="before"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
              />
            </svg>
            Avant intervention
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="AFTER"
            id="after"
            className="peer sr-only"
            disabled={intervention.status === "PENDING"}
          />
          <Label
            htmlFor="after"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-9"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            Après intervention
          </Label>
        </div>
      </RadioGroup>

      {/* Formulaire d'état */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description {stateType === "BEFORE" ? "avant" : "après"}{" "}
                  intervention
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      stateType === "BEFORE"
                        ? "Décrivez l'état initial avant l'intervention..."
                        : "Décrivez les actions effectuées et l'état final..."
                    }
                    className="h-24"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Téléchargement d'images */}
          <MultiImageDropzone
            value={fileStates}
            dropzoneOptions={{
              maxFiles: 6,
            }}
            onChange={(files) => {
              setFileStates(files);
            }}
            // className="w-20"
            onFilesAdded={async (addedFiles) => {
              setFileStates([...fileStates, ...addedFiles]);
            }}
          />

          <FormField
            control={form.control}
            name="conclusion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Conclusion {stateType === "BEFORE" ? "avant" : "après"}{" "}
                  intervention
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      stateType === "BEFORE"
                        ? "Décrivez l'état initial avant l'intervention..."
                        : "Décrivez les actions effectuées et l'état final..."
                    }
                    className="h-24"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bouton de soumission */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : stateType === "BEFORE" ? (
              "Démarrer l'intervention"
            ) : (
              "Compléter l'intervention"
            )}
          </Button>
        </form>
      </Form>

      {/* État actuel de l'intervention */}
      <div className="p-4 bg-muted rounded-md">
        <h3 className="font-medium mb-2">État actuel de l'intervention</h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              intervention.status === "PENDING"
                ? "bg-yellow-500"
                : intervention.status === "IN_PROGRESS"
                ? "bg-blue-500"
                : intervention.status === "COMPLETED"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          ></div>
          <span>
            {intervention.status === "PENDING"
              ? "En attente"
              : intervention.status === "IN_PROGRESS"
              ? "En cours"
              : intervention.status === "COMPLETED"
              ? "Terminée"
              : "Annulée"}
          </span>
        </div>
      </div>
    </div>
  );
}
