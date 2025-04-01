import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, quantity } = body;

    // Vérifier si un matériel avec ce nom existe déjà
    const existingMaterial = await prisma.material.findUnique({
      where: {
        name,
      },
    });

    if (existingMaterial) {
      return NextResponse.json(
        {
          success: false,
          message: "Un matériel avec ce nom existe déjà",
        },
        { status: 400 }
      );
    }

    const materiels = await prisma.material.create({
      data: {
        name,
        description,
        quantity: quantity || 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Matériel créé avec succès",
      data: materiels,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la création du matériel",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const materials = await prisma.material.findMany();

    return NextResponse.json({
      success: true,
      data: materials,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message:
          "Une erreur est survenue lors de la récupération des matériels",
      },
      { status: 500 }
    );
  }
}
