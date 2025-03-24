import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, description } = body;
    const id = params.id;

    // Vérifier si une autre équipe a déjà ce nom
    const existingTeam = await prisma.team.findFirst({
      where: {
        name,
        id: {
          not: id,
        },
      },
    });

    if (existingTeam) {
      return NextResponse.json({
        success: false,
        message: "Le nom doit être unique. Ce nom existe déjà.",
      });
    }

    const updatedTeam = await prisma.team.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Équipe mise à jour avec succès",
      data: updatedTeam,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la mise à jour de l'équipe",
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

    // Vérifier si l'équipe existe
    const team = await prisma.team.findUnique({
      where: {
        id: id,
      },
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer l'équipe
    await prisma.team.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Équipe supprimée avec succès",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la suppression de l'équipe",
      },
      { status: 500 }
    );
  }
}
