import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address } = body;

    const existingMail = await prisma.client.findUnique({
      where: { email },
    });

    if (existingMail) {
      return NextResponse.json({
        success: false,
        message: "Le nom doit être unique. Ce nom existe déjà.",
      });
    }

    const existingPhone = await prisma.client.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      console.log("Téléphone déjà utilisé:", phone);
      return NextResponse.json({
        success: false,
        message: "Le nom doit être unique. Ce nom existe déjà.",
      });
    }

    const team = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    if (!team) {
      throw new Error("Failed to create team");
    }

    return NextResponse.json({
      success: true,
      message: "Client créée avec succès",
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
    const team = await prisma.client.findMany();
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, email, phone, address } = body;
    // const id = params.id;

    console.log("body: " + body);
    // console.log("params: " + params);

    // Vérifier si une autre équipe a déjà ce nom

    // const updatedTeam = await prisma.client.update({
    //   where: {
    //     id: id,
    //   },
    //   data: {
    //     name,
    //     email,
    //     phone,
    //     address,
    //   },
    // });

    // return NextResponse.json({
    //   success: true,
    //   message: "Équipe mise à jour avec succès",
    //   data: updatedTeam,
    // });
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
