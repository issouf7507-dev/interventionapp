import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const {
      // interventionId,
      type,
      description,
      state,
      conclusion,
    } = body;

    const interventionId = (await params).id;

    const intervention = await prisma.intervention.findUnique({
      where: {
        id: interventionId,
      },
    });

    if (!intervention) {
      return NextResponse.json({
        success: false,
        message: "cette intervention n exist pas ",
      });
    }

    const newStatus = type === "BEFORE" ? "IN_PROGRESS" : "COMPLETED";

    const newStatus2 = type == "AFTER" ? "COMPLETED" : "CANCEL";

    let interventionState;
    let updatedIntervention;

    if (newStatus === "IN_PROGRESS") {
      interventionState = await prisma.interventionState.create({
        data: {
          type,
          conclusion,
          description,
          interventionId,
          // photos: {
          //   create: state.map((url: string) => ({
          //     photo: { connect: { id: url } },
          //   })),
          // },

          photos: {
            create: state.map((url: any) => ({
              url,
            })),
          },
        },
      });

      updatedIntervention = await prisma.intervention.update({
        where: {
          id: interventionId,
        },
        data: {
          status: newStatus,
        },
      });
    } else if (newStatus2 === "COMPLETED") {
      interventionState = await prisma.interventionState.create({
        data: {
          type,
          conclusion,
          description,
          interventionId,
          // photos: {
          //   create: state.map((url: string) => ({
          //     photo: { connect: { id: url } },
          //   })),
          // },

          photos: {
            create: state.map((url: any) => ({
              url,
            })),
          },
        },
      });

      updatedIntervention = await prisma.intervention.update({
        where: {
          id: interventionId,
        },
        data: {
          status: newStatus2,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Intervention mise à jour avec succès",
      updatedIntervention,
      interventionState,

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
