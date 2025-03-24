"use server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend("re_TJt7ztEr_5CDn8S9ahPTAZwruzABgX5VE");

export async function createIntervention({
  title,
  description,
  location,
  startDate,
  endDate,
  clientId,
  interventionTypeId,
  employeeIds,
  materials,
}: {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  clientId: string;
  interventionTypeId: string;
  employeeIds: string[];
  materials: string[];
}) {
  try {
    // Vérifier que les données nécessaires sont présentes
    if (
      !title ||
      !description ||
      !location ||
      !startDate ||
      !endDate ||
      !clientId ||
      !interventionTypeId
    ) {
      return {
        success: false,
        message: "Tous les champs obligatoires doivent être remplis",
      };
    }

    if (!employeeIds || employeeIds.length === 0) {
      return {
        success: false,
        message: "Au moins un employé doit être sélectionné",
      };
    }

    if (!materials || materials.length === 0) {
      return {
        success: false,
        message: "Au moins un matériel doit être sélectionné",
      };
    }

    const technicians = await prisma.employee.findMany({
      where: {
        id: {
          in: employeeIds,
        },
      },
    });

    if (technicians.length !== employeeIds.length) {
      return {
        success: false,
        message: "Un ou plusieurs employés sélectionnés n'existent pas",
      };
    }

    // Créer l'intervention avec toutes ses relations
    const intervention = await prisma.intervention.create({
      data: {
        title,
        description,
        location,
        startDate,
        endDate,
        clientId,
        interventionTypeId,

        // Utiliser la table pivot EmployeeIntervention pour associer les employés
        employees: {
          create: employeeIds.map((employeeId) => ({
            employee: {
              connect: { id: employeeId },
            },
            // assignedAt est défini automatiquement avec @default(now())
          })),
        },

        // Relation many-to-many via la table de jointure InterventionMaterial
        materials: {
          create: materials.map((materialId) => ({
            material: {
              connect: { id: materialId },
            },
            quantity: 1, // Quantité par défaut
          })),
        },
      },
      // Inclure les relations dans la réponse
      include: {
        client: true,
        interventionType: true,
        employees: {
          include: {
            employee: true,
          },
        },
        materials: {
          include: {
            material: true,
          },
        },
      },
    });

    if (!intervention) {
      return {
        success: false,
        message:
          "Une erreur s'est produite lors de la création de l'intervention",
      };
    }

    // Envoi d'emails aux techniciens en utilisant une approche simplifiée
    for (const technician of technicians) {
      try {
        resend.emails.send({
          from: "entar225@gmail.com",
          to: "ouattaraissouf7507@gmail.com",
          subject: "Hello World",
          html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
        });
      } catch (emailError) {
        console.error(
          `Erreur lors de l'envoi de l'email au technicien ${technician.id}:`,
          emailError
        );
        // On continue même si l'envoi d'email échoue
      }
    }

    return { success: true, intervention };
  } catch (error) {
    console.error("Erreur lors de la création de l'intervention:", error);
    return { success: false, message: "Une erreur s'est produite", error };
  }
}

export async function getAllInterventions() {
  try {
    const interventions = await prisma.intervention.findMany({
      include: {
        client: true,
        employees: {
          include: {
            employee: true,
          },
        },
        materials: {
          include: {
            material: true,
          },
        },

        states: {
          include: {
            photos: true,
          },
        },
      },
    });
    return { success: true, interventions };
  } catch (error) {
    console.error("Erreur lors de la récupération des interventions:", error);
    return { success: false, message: "Une erreur s'est produite", error };
  }
}

export async function getInterventionById(id: string) {
  try {
    const intervention = await prisma.intervention.findUnique({
      where: { id },
      include: {
        employees: {
          include: {
            employee: true,
          },
        },
      },
    });
    return { success: true, intervention };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'intervention:", error);
    return { success: false, message: "Une erreur s'est produite", error };
  }
}

export async function updateInterventionState({
  interventionId,
  type,
  description,
  imageUrls = [],
}: {
  interventionId: string;
  type: "BEFORE" | "AFTER";
  description: string;
  imageUrls?: string[];
}) {
  try {
    // Vérifier que les données nécessaires sont présentes
    if (!interventionId || !type || !description) {
      return {
        success: false,
        message: "Tous les champs obligatoires doivent être remplis",
      };
    }

    // Récupérer l'intervention existante
    const existingIntervention = await prisma.intervention.findUnique({
      where: { id: interventionId },
    });

    if (!existingIntervention) {
      return {
        success: false,
        message: "Intervention non trouvée",
      };
    }

    // Mettre à jour le statut de l'intervention en fonction du type d'état
    const newStatus = type === "BEFORE" ? "IN_PROGRESS" : "COMPLETED";

    const newStatus2 = type == "AFTER" ? "COMPLETED" : "CANCEL";

    // Créer l'état de l'intervention

    let interventionState;
    let updatedIntervention;

    if (newStatus === "IN_PROGRESS") {
      interventionState = await prisma.interventionState.create({
        data: {
          interventionId,
          type,
          description,
          photos: {
            create: imageUrls.map((url) => ({
              url,
            })),
          },
        },
        include: {
          photos: true,
        },
      });

      // Mettre à jour le statut de l'intervention
      updatedIntervention = await prisma.intervention.update({
        where: { id: interventionId },
        data: {
          status: newStatus,
        },
        include: {
          client: true,
          interventionType: true,
          employees: {
            include: {
              employee: true,
            },
          },
          materials: {
            include: {
              material: true,
            },
          },
          states: {
            include: {
              photos: true,
            },
          },
        },
      });
    } else if (newStatus2 == "COMPLETED") {
      interventionState = await prisma.interventionState.create({
        data: {
          interventionId,
          type,
          description,
          photos: {
            create: imageUrls.map((url) => ({
              url,
            })),
          },
        },
        include: {
          photos: true,
        },
      });

      // Mettre à jour le statut de l'intervention
      updatedIntervention = await prisma.intervention.update({
        where: { id: interventionId },
        data: {
          status: newStatus2,
        },
        include: {
          client: true,
          interventionType: true,
          employees: {
            include: {
              employee: true,
            },
          },
          materials: {
            include: {
              material: true,
            },
          },
          states: {
            include: {
              photos: true,
            },
          },
        },
      });
    }

    return {
      success: true,
      interventionState,
      intervention: updatedIntervention,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de l'état de l'intervention:",
      error
    );
    return { success: false, message: "Une erreur s'est produite", error };
  }
}

// Fonction pour télécharger des images d'une intervention
export async function uploadInterventionImages(formData: FormData) {
  try {
    const interventionId = formData.get("interventionId") as string;
    const type = formData.get("type") as "BEFORE" | "AFTER";
    const description = formData.get("description") as string;

    // Validation des champs requis
    if (!interventionId || !type || !description) {
      return {
        success: false,
        message: "Tous les champs obligatoires doivent être remplis",
      };
    }

    // Vérifier si l'intervention existe
    const intervention = await prisma.intervention.findUnique({
      where: { id: interventionId },
    });

    if (!intervention) {
      return {
        success: false,
        message: "Intervention non trouvée",
      };
    }

    // Récupérer toutes les images du formData
    const imageFormEntries = Array.from(formData.entries()).filter(
      ([key, value]) => key.startsWith("image-") && value instanceof File
    );

    // Vérifier s'il y a des images
    if (imageFormEntries.length === 0) {
      return {
        success: false,
        message: "Aucune image n'a été sélectionnée",
      };
    }

    const imageUrls: string[] = [];
    const uploadErrors: string[] = [];

    // Limiter le nombre d'images à 10 par sécurité
    const MAX_IMAGES = 10;
    const imagesToProcess = imageFormEntries.slice(0, MAX_IMAGES);

    // Traiter chaque image
    for (const [key, value] of imagesToProcess) {
      if (value instanceof File) {
        try {
          // Vérifier la taille de l'image (max 5MB)
          const MAX_SIZE = 5 * 1024 * 1024; // 5MB
          if (value.size > MAX_SIZE) {
            uploadErrors.push(
              `L'image ${value.name} dépasse la taille maximale autorisée (5MB)`
            );
            continue;
          }

          // Vérifier le type de fichier
          if (!value.type.startsWith("image/")) {
            uploadErrors.push(
              `Le fichier ${value.name} n'est pas une image valide`
            );
            continue;
          }

          // Convertir le File en base64
          const buffer = await value.arrayBuffer();
          const base64Image = Buffer.from(buffer).toString("base64");

          // Upload vers Imgur
          const response = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
              Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: base64Image,
              type: "base64",
              name: value.name,
            }),
          });

          if (!response.ok) {
            throw new Error(`Erreur Imgur: ${response.statusText}`);
          }

          const data = await response.json();
          if (data.success) {
            imageUrls.push(data.data.link);
          } else {
            throw new Error(
              data.data.error || "Erreur lors de l'upload vers Imgur"
            );
          }
        } catch (error) {
          console.error(
            `Erreur lors de l'upload de l'image ${value.name}:`,
            error
          );
          uploadErrors.push(`Échec de l'upload de l'image ${value.name}`);
        }
      }
    }

    // Mettre à jour l'état de l'intervention même s'il y a eu des erreurs d'upload
    const updateResult = await updateInterventionState({
      interventionId,
      type,
      description,
      imageUrls,
    });

    // Ajouter les erreurs d'upload au résultat
    if (updateResult.success) {
      return {
        ...updateResult,
        uploadedImagesCount: imageUrls.length,
        totalImagesAttempted: imagesToProcess.length,
        uploadErrors: uploadErrors.length > 0 ? uploadErrors : undefined,
      };
    } else {
      return {
        ...updateResult,
        uploadErrors: uploadErrors.length > 0 ? uploadErrors : undefined,
      };
    }
  } catch (error) {
    console.error("Erreur lors du téléchargement des images:", error);
    return {
      success: false,
      message: "Une erreur s'est produite lors du téléchargement des images",
      error,
    };
  }
}
