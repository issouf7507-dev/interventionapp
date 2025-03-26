import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phoneNumber, address, employeeTypeId } =
      body;
    const slug = (await params).id;

    const employee = await prisma.employee.update({
      where: { id: slug },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        employeeTypeId,
      },
    });

    // Mise à jour séparée de l'utilisateur

    return NextResponse.json({
      success: true,
      message: "mise à jour avec succès",
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
    const employee = await prisma.employee.delete({
      where: {
        id: slug,
      },
    });
    if (!employee) {
      return NextResponse.json(
        { success: false, message: "Équipe non trouvée" },
        { status: 404 }
      );
    }
    // Supprimer
    return NextResponse.json({
      success: true,
      message: "Suppression effectuee avec succès",
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
