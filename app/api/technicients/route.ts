import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  generateEmployeeCredentials,
  hashPassword,
} from "@/app/utils/employee-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phoneNumber, address, employeeTypeId } =
      body;

    const existingMail = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingMail) {
      return NextResponse.json({
        success: false,
        message: "Cette adresse email existe déjà",
      });
    }

    const existingPhoneNumber = await prisma.employee.findUnique({
      where: { phoneNumber },
    });

    if (existingPhoneNumber) {
      return NextResponse.json({
        success: false,
        message: "Cette numéro de téléphone existe déjà",
      });
    }

    // Générer les identifiants
    const { username, password } = generateEmployeeCredentials(
      firstName,
      lastName
    );
    const hashedPassword = await hashPassword(password);

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        employeeTypeId,
        username,
        password: hashedPassword,
        passwordNotHashed: password,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Technicien créé avec succès",
      data: {
        ...employee,
        password, // On renvoie le mot de passe en clair une seule fois
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de la création du technicien",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        employeeType: true,
      },
    });

    return NextResponse.json({ success: true, data: employees });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message:
          "Une erreur est survenue lors de la récupération des techniciens",
      },
      { status: 500 }
    );
  }
}
