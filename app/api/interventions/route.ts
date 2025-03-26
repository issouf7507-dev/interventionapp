import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      location,
      startDate,
      endDate,
      clientId,
      interventionTypeId,
      employeeIds,
      materials,
    } = body;

    if (!employeeIds || employeeIds.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Au moins un employé doit être sélectionné",
      });
    }

    if (!materials || materials.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Au moins un material doit être sélectionné",
      });
    }

    const listemployee = await prisma.employee.findMany({
      where: {
        id: {
          in: employeeIds,
        },
      },
    });

    if (listemployee.length != employeeIds.length) {
      return NextResponse.json({
        success: false,
        message: "Un ou plusieurs employés sélectionnés n'existent pas",
      });
    }

    const listmateriel = await prisma.material.findMany({
      where: {
        id: {
          in: materials,
        },
      },
    });

    if (listmateriel.length != materials.length) {
      return NextResponse.json({
        success: false,
        message: "Un ou plusieurs materials sélectionnés n'existent pas",
      });
    }

    const intervention = await prisma.intervention.create({
      data: {
        title,
        description,
        location,
        startDate,
        endDate,
        clientId,
        interventionTypeId,
        employees: {
          create: employeeIds.map((employeeId: string) => ({
            employee: {
              connect: { id: employeeId },
            },
          })),
        },
        materials: {
          create: materials.map((material: string) => ({
            material: {
              connect: { id: material },
            },
          })),
        },
      },
    });

    if (!intervention) {
      return NextResponse.json({
        success: false,
        message:
          "Une erreur s'est produite lors de la création de l'intervention",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Équipe créée avec succès",
      intervention,
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
    if (!interventions) {
      return NextResponse.json(
        { success: false, message: "Aucune équipe trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: interventions });
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
