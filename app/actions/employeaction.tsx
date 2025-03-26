"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

export async function createEmployee({
  firstName,
  lastName,
  email,
  phoneNumber,
  address,
  employeeTypeId,
  userId,
}: {
  firstName: string;
  lastName: string;
  email: string | undefined;
  phoneNumber: string | undefined;
  address: string | undefined;
  employeeTypeId: string;
  userId: string;
}) {
  try {
    const existingMail = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingMail) {
      return { success: false, message: "Cette adresse email existe déjà" };
    }

    const existingPhoneNumber = await prisma.employee.findUnique({
      where: { phoneNumber },
    });

    if (existingPhoneNumber) {
      return {
        success: false,
        message: "Cette numéro de téléphone existe déjà",
      };
    }
    const user = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        employeeTypeId,
        userId,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Erreur détaillée:", error);

    // Tenter d'extraire plus d'informations sur l'erreur
    let errorMessage = "Erreur lors de la création de l'employé";

    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }

    return {
      success: false,
      message: errorMessage,
      error, // Inclure l'erreur complète pour le débogage
    };
  }
}

export async function updateEmployee(
  id: string,
  firstName: string,
  lastName: string,
  email: string | undefined,
  phoneNumber: string | undefined,
  address: string | undefined,
  employeeTypeId: string
) {
  try {
    const employee = await prisma.employee.update({
      where: { id },
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
    await prisma.user.update({
      where: { id: employee.userId },
      data: {
        email,
        name: `${firstName} ${lastName}`,
      },
    });

    return { success: true, employee };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la mise à jour de l'employé",
    };
  }
}

export async function getAllEmployees() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        employeeType: true,
        user: true,
      },
    });

    return { success: true, employees };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la récupération des employés",
    };
  }
}

export async function deleteEmployee(id: string) {
  try {
    const employee = await prisma.employee.delete({
      where: { id },
    });

    if (!employee) {
      return { success: false, message: "Employé non trouvé" };
    }
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la suppression de l'employé",
    };
  }
}
