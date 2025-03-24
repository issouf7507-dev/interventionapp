"use server";
import prisma from "@/lib/prisma";

export async function getAllClients() {
  try {
    const client = await prisma.client.findMany({
      include: {
        interventions: true,
      },
    });

    return { success: true, client };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la récupération des clients",
    };
  }
}

export async function createClient({
  name,
  email,
  phone,
  address,
}: {
  name: string;
  email: string;
  phone: string;
  address: string;
}) {
  try {
    const existingMail = await prisma.client.findUnique({
      where: { email },
    });

    if (existingMail) {
      console.log("Email déjà utilisé:", email);
      return { success: false, message: "Cette adresse email existe déjà" };
    }

    const existingPhone = await prisma.client.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      console.log("Téléphone déjà utilisé:", phone);
      return {
        success: false,
        message: "Ce numéro de téléphone existe déjà",
      };
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    return { success: true, message: "tout est bon", client };
  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    return {
      success: false,
      message: "Erreur lors de la création du client",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updateClient({
  id,
  name,
  email,
  phone,
  address,
}: {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}) {
  try {
    const client = await prisma.client.update({
      where: { id },
      data: { name, email, phone, address },
    });

    return { success: true, message: "Client modifié avec succès", client };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la modification du client",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function deleteClient(id: string) {
  try {
    const client = await prisma.client.delete({
      where: { id },
    });

    if (!client) {
      return { success: false, message: "Client non trouvé" };
    }

    return { success: true, message: "Client supprimé avec succès" };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la suppression du client",
    };
  }
}
