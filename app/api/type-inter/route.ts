import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description } = body;

    // Vérifier si un matériel avec ce nom existe déjà
    const existinginterventionType = await prisma.interventionType.findUnique({
      where: {
        name,
      },
    });

    if (existinginterventionType) {
      return NextResponse.json(
        {
          success: false,
          message: "cette data n'existe déjà",
        },
        { status: 400 }
      );
    }

    const interventionType = await prisma.interventionType.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({
      success: true,
      message: "data créé avec succès",
      data: interventionType,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la création ",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const interventionTypes = await prisma.interventionType.findMany();

    return NextResponse.json({
      success: true,
      data: interventionTypes,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la récupération",
      },
      { status: 500 }
    );
  }
}
