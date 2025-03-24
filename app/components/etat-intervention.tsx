"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icons } from "./icons";
import { Intervention } from "@prisma/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boolean, z } from "zod";
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
// import { uploadInterventionImages } from "@/app/actions/interventionaction";

// Type pour le résultat de uploadInterventionImages
type UploadInterventionResult = {
  success: boolean;
  message?: string;
  error?: any;
  interventionState?: any;
  intervention?: any;
  uploadedImagesCount?: number;
  totalImagesAttempted?: number;
  uploadErrors?: string[];
};

// Composant toast simple
type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    // Dans une implémentation réelle, vous afficheriez le toast à l'écran
    console.log(`Toast: ${variant} - ${title}: ${description}`);
    const newToast = { title, description, variant };
    setToasts([...toasts, newToast]);

    // Simuler la disparition du toast après 3 secondes
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((t) => t !== newToast));
    }, 3000);

    // Ici, vous pourriez utiliser une bibliothèque comme react-hot-toast ou
    // avoir votre propre implémentation de toast
  };

  return { toast, toasts };
};

const updateStateSchema = z.object({
  interventionId: z.string(),
  type: z.enum(["BEFORE", "AFTER"]),
  description: z.string().min(1, "La description est requise"),
});

type UpdateStateFormValues = z.infer<typeof updateStateSchema>;

export function EtatIntervention({
  intervention,
  openUpdate,
  setOpenUpdate,
  queryAllInterventions,
}: {
  intervention: Intervention;
  openUpdate: boolean;
  setOpenUpdate: (openUpdate: boolean) => void;
  queryAllInterventions: UseQueryResult<any, Error>;
}) {
  const { toast } = useToast();
  const [stateType, setStateType] = useState<"BEFORE" | "AFTER">("BEFORE");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_IMAGES = 10; // Limite maximum d'images

  const form = useForm<UpdateStateFormValues>({
    resolver: zodResolver(updateStateSchema),
    defaultValues: {
      interventionId: intervention.id,
      type: "BEFORE",
      description: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      // Vérifier si on dépasse la limite d'images
      if (images.length + newFiles.length > MAX_IMAGES) {
        toast({
          title: "Limite d'images atteinte",
          description: `Vous ne pouvez pas ajouter plus de ${MAX_IMAGES} images`,
          variant: "destructive",
        });
        // On ajoute uniquement les images jusqu'à la limite
        const remainingSlots = MAX_IMAGES - images.length;
        if (remainingSlots > 0) {
          setImages((prev) => [...prev, ...newFiles.slice(0, remainingSlots)]);
        }
        return;
      }

      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: UpdateStateFormValues) => {
    setIsSubmitting(true);

    try {
      // Créer un FormData pour envoyer les images
      const formData = new FormData();
      formData.append("interventionId", data.interventionId);
      formData.append("type", data.type);
      formData.append("description", data.description);

      // Ajouter les images au FormData
      images.forEach((image, index) => {
        formData.append(`image-${index}`, image);
      });

      // Convertir les entrées en tableau pour éviter l'erreur d'itération
      const entries = Array.from(formData.entries());
      for (const pair of entries) {
        console.log(pair);
      }

      // Appeler la fonction du serveur et typer le résultat
      const result = (await uploadInterventionImages(
        formData
      )) as UploadInterventionResult;

      if (result.success) {
        toast({
          title: "État mis à jour",
          description:
            data.type === "BEFORE"
              ? "L'intervention a été mise à jour et passée en cours"
              : "L'intervention a été complétée avec succès",
        });

        // Afficher un résumé des uploads d'images s'il y en a
        if (result.uploadedImagesCount && result.uploadedImagesCount > 0) {
          toast({
            title: "Images téléchargées",
            description: `${result.uploadedImagesCount} sur ${result.totalImagesAttempted} images ont été téléchargées avec succès.`,
          });
        }

        // Afficher les erreurs d'upload s'il y en a
        if (result.uploadErrors && result.uploadErrors.length > 0) {
          toast({
            title: "Erreurs d'upload",
            description: `Certaines images n'ont pas pu être téléchargées. Vérifiez le format et la taille.`,
            variant: "destructive",
          });
        }

        // Réinitialiser le formulaire et les images
        form.reset();
        setImages([]);

        // Dans une application réelle, vous pourriez rafraîchir les données ou rediriger l'utilisateur
      } else {
        toast({
          title: "Erreur",
          description:
            result.message || "Une erreur est survenue lors de la mise à jour",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setOpenUpdate(false);
      queryAllInterventions.refetch();
      // set
    }
  };

  return (
    <div className="space-y-6">
      <RadioGroup
        defaultValue="BEFORE"
        className="grid grid-cols-2 gap-4"
        onValueChange={(value) => {
          setStateType(value as "BEFORE" | "AFTER");
          form.setValue("type", value as "BEFORE" | "AFTER");
        }}
      >
        <div>
          <RadioGroupItem value="BEFORE" id="before" className="peer sr-only" />
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="images">
                Photos {stateType === "BEFORE" ? "avant" : "après"} intervention
              </Label>
              <span className="text-sm text-muted-foreground">
                {images.length} / {MAX_IMAGES} images
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="cursor-pointer"
                disabled={images.length >= MAX_IMAGES}
              />
              <p className="text-sm text-muted-foreground">
                Sélectionnez jusqu'à {MAX_IMAGES} images pour documenter l'état{" "}
                {stateType === "BEFORE" ? "avant" : "après"} l'intervention
              </p>
            </div>

            {/* Aperçu des images */}
            {images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Aperçu des images ({images.length})
                </h4>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Aperçu ${index}`}
                        className="h-20 w-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center transition-opacity"
                          aria-label="Supprimer l'image"
                        >
                          ×
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 text-xs bg-black bg-opacity-50 text-white px-1 rounded">
                        {(image.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
