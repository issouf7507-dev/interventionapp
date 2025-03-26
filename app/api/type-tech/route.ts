import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description } = body;

    const existingType = await prisma.employeeType.findUnique({
      where: {
        name,
      },
    });

    if (existingType) {
      return NextResponse.json({
        success: false,
        message: "Le nom doit être unique. Ce nom existe déjà.",
      });
    }

    const type = await prisma.employeeType.create({
      data: {
        name,
        description,
      },
    });

    if (!type) {
      return NextResponse.json({
        success: false,
        message: "une erreur c'est produite",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Type created successfully",
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
    const employeeType = await prisma.employeeType.findMany();

    if (!employeeType) {
      return NextResponse.json(
        { success: false, message: "Aucune data trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: employeeType });
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
