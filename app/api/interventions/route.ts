import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      location,
      latitude,
      longitude,
      placeId,
      postalCode,
      region,
      country,
      formattedAddress,
      startDate,
      endDate,
      selectionType,
      clientId,
      interventionTypeId,
      conclusion,
      teamId,
      employeeIds = [],
      materials,
    } = body;

    // Validation des inputs
    if (
      selectionType === "employees" &&
      (!employeeIds || employeeIds.length === 0)
    ) {
      return NextResponse.json({
        success: false,
        message: "Au moins un employé doit être sélectionné",
      });
    }

    if (selectionType === "teams" && !teamId) {
      return NextResponse.json({
        success: false,
        message: "Une équipe doit être sélectionnée",
      });
    }

    if (!materials || materials.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Au moins un matériel doit être sélectionné",
      });
    }

    // Vérification des existances
    if (employeeIds.length > 0) {
      const listemployee = await prisma.employee.findMany({
        where: { id: { in: employeeIds } },
      });
      if (listemployee.length !== employeeIds.length) {
        return NextResponse.json({
          success: false,
          message: "Un ou plusieurs employés sélectionnés n'existent pas",
        });
      }
    }

    if (selectionType === "teams" && teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { employees: true },
      });

      if (!team) {
        return NextResponse.json({
          success: false,
          message: "L'équipe sélectionnée n'existe pas",
        });
      }
    }

    const listmateriel = await prisma.material.findMany({
      where: { id: { in: materials } },
    });
    if (listmateriel.length !== materials.length) {
      return NextResponse.json({
        success: false,
        message: "Un ou plusieurs matériels sélectionnés n'existent pas",
      });
    }

    // Création de base de l'intervention
    const baseData: any = {
      title,
      description,
      location,
      startDate,
      endDate,
      selectionType,
      clientId,
      interventionTypeId,
      conclusion,
      materials: {
        create: materials.map((material: string) => ({
          material: { connect: { id: material } },
        })),
      },
    };

    // Ajouter les coordonnées si disponibles
    if (latitude && longitude) {
      baseData.latitude = latitude;
      baseData.longitude = longitude;
      baseData.placeId = placeId;
      baseData.postalCode = postalCode;
      baseData.region = region;
      baseData.country = country;
    }

    // if (formattedAddress) {
    //   baseData.formattedAddress = formattedAddress;
    // }

    // Ajout des employés si sélectionnés
    if (selectionType === "employees" && employeeIds.length > 0) {
      baseData.employees = {
        create: employeeIds.map((employeeId: string) => ({
          employee: { connect: { id: employeeId } },
        })),
      };
    }

    // Créer l'intervention
    const intervention = await prisma.intervention.create({
      data: baseData,
    });

    // Si l'équipe est sélectionnée, associer les membres de l'équipe à l'intervention
    // if (selectionType === "teams" && teamId) {
    //   const teamMembers = await prisma.employeeInTeam.findMany({
    //     where: { idTeam: teamId },
    //   });

    //   // Mettre à jour les membres d'équipe pour les associer à l'intervention
    //   for (const member of teamMembers) {
    //     await prisma.employeeInTeam.update({
    //       where: { id: member.id },
    //       data: { interventionId: intervention.id },
    //     });
    //   }
    // }

    return NextResponse.json({
      success: true,
      message: "Intervention créée avec succès",
      intervention,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message:
          "Une erreur est survenue lors de la création de l'intervention",
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
        team: {
          include: {
            employees: true,
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
