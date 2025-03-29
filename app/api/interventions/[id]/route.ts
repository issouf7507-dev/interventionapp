import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const id = params.id;

    // Vérifier si l'intervention existe
    // const intervention = await prisma.intervention.findUnique({
    //   where: { id },
    // });

    // if (!intervention) {
    //   return NextResponse.json(
    //     { success: false, message: "Intervention non trouvée" },
    //     { status: 404 }
    //   );
    // }

    // Déterminer le type de contenu et extraire les données en conséquence
    let data: Record<string, any> = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // Traiter les données JSON
      data = await req.json();
    } else if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      // Traiter les données de formulaire
      const formData = await req.formData();
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`Fichier reçu: ${key}`, value);
          // Traitement des fichiers si nécessaire
        } else {
          data[key] = value;
        }
      });
    } else {
      // Type de contenu non pris en charge
      return NextResponse.json(
        {
          success: false,
          message:
            "Content-Type non pris en charge. Utilisez application/json ou multipart/form-data.",
        },
        { status: 415 }
      );
    }

    // Mise à jour de l'intervention
    // const updatedIntervention = await prisma.intervention.update({
    //   where: { id },
    //   data: {
    //     // Mettre à jour uniquement les champs fournis
    //     ...(data.title && { title: data.title }),
    //     ...(data.description && { description: data.description }),
    //     ...(data.location && { location: data.location }),
    //     ...(data.status && { status: data.status }),
    //     // Ajoutez d'autres champs selon les besoins
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: "Intervention mise à jour avec succès",
      // data: updatedIntervention,
    });
  } catch (err) {
    console.error("Erreur:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          "Une erreur est survenue lors de la mise à jour de l'intervention",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Vérifier si l'intervention existe
    const intervention = await prisma.intervention.findUnique({
      where: { id },
    });

    if (!intervention) {
      return NextResponse.json(
        { success: false, message: "Intervention non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer l'intervention
    await prisma.intervention.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Intervention supprimée avec succès",
    });
  } catch (err) {
    console.error("Erreur:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          "Une erreur est survenue lors de la suppression de l'intervention",
      },
      { status: 500 }
    );
  }
}
