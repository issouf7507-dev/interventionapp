import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { name, description } = body;

    const slug = (await params).id;

    const interventionType = await prisma.interventionType.update({
      where: { id: slug },
      data: { name, description },
    });

    return NextResponse.json({
      success: true,
      message: "Équipe mise à jour avec succès",
      interventionType,
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

    const client = await prisma.interventionType.delete({
      where: { id: slug },
    });

    if (!client) {
      return NextResponse.json({
        success: false,
        message: "Client non trouvé",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Client supprimée avec succès",
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
