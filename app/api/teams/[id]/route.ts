import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { name, description, employeeIds } = body;
    const slug = (await params).id;

    const employeesExist = await prisma.employee.findMany({
      where: {
        id: { in: employeeIds }, // Assure-toi que `employeeIds` contient les bons IDs
      },
    });

    if (employeesExist) {
      // console.log(employeesExist);

      return NextResponse.json({
        success: false,
        message: "Le nom doit être unique. Ce nom existe déjà.",
      });
    }

    const updatedTeam = await prisma.team.update({
      where: {
        id: slug,
      },
      data: {
        name,
        description,

        employees: {
          connect: employeeIds.map((id: string) => ({ id })), // Connecter les employés par leurs IDs
        },
      },
    });

    if (!updatedTeam) {
      throw new Error("Failed to create team");
    }

    return NextResponse.json({
      success: true,
      message: "Équipe mise à jour avec succès",
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const slug = (await params).id;

    // Vérifier si l'équipe existe
    const team = await prisma.team.findUnique({
      where: {
        id: slug,
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
        id: slug,
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
