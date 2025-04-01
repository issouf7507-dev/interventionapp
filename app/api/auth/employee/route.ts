import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const employee = await prisma.employee.findUnique({
      where: { username },
    });

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Identifiants or password invalides",
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, employee.password!);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Identifiants or password invalides",
        },
        { status: 401 }
      );
    }

    // Générer un token JWT avec jose
    const secret = new TextEncoder().encode(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    );
    const token = await new SignJWT({
      id: employee.id,
      username: employee.username,
      firstName: employee.firstName,
      lastName: employee.lastName,
      employeeTypeId: employee.employeeTypeId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    return NextResponse.json({
      success: true,
      message: "Connexion réussie",
      token,
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        employeeTypeId: employee.employeeTypeId,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de l'authentification",
      },
      { status: 500 }
    );
  }
}
