import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, employeeIds } = body;

    const existingTeam = await prisma.team.findUnique({
      where: {
        name,
      },
    });

    if (existingTeam) {
      return NextResponse.json({
        success: false,
        message: "Le nom doit être unique. Ce nom existe déjà.",
      });
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,

        employees: {
          create: employeeIds.map((employeeId: string) => ({
            employee: {
              connect: { id: employeeId },
            },
          })),
        },
      },
    });

    if (!team) {
      throw new Error("Failed to create team");
    }

    return NextResponse.json({
      success: true,
      message: "Équipe créée avec succès",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la création de l'équipe",
      },
      { status: 500 }
    );
  }
}

export async function GET(res: Request) {
  try {
    const team = await prisma.team.findMany({
      include: {
        employees: {
          include: {
            employee: true,
          },
        },
      },
    });
    if (team.length === 0) {
      return NextResponse.json(
        { success: false, message: "Aucune équipe trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: team });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la récupération des équipes",
      },
      { status: 500 }
    );
  }
}
