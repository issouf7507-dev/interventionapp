"use server";

import prisma from "../lib/prisma";

export async function getAllMaterial() {
  try {
    const materiels = await prisma.material.findMany();
    if (!materiels)
      return { success: false, message: "erreur lors de la récupération " };

    return { success: true, materiels };
  } catch (error) {}
}
export async function createMaterial({
  name,
  description,
  quantity,
}: {
  name: string;
  description: string;
  quantity: number;
}) {
  try {
    const materiels = await prisma.material.create({
      data: {
        name,
        description,
        quantity,
      },
    });

    if (!materiels) {
    }

    return { success: true, message: "tout est bon", materiels };
  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    return {
      success: false,
      message: "Erreur lors de la création du materiel",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updateMaterial({
  id,
  name,
  description,
  quantity,
}: {
  id: string;
  name: string;
  description: string;
  quantity: number;
}) {
  try {
    const materiels = await prisma.material.update({
      where: { id },
      data: { name, description, quantity },
    });

    if (!materiels) {
      return { success: false, message: "erreur lors de la mise à jour" };
    }

    return { success: true, message: "tout est bon", materiels };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du materiel:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour du materiel",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function deleteMaterial(id: string) {
  try {
    const materiels = await prisma.material.delete({
      where: { id },
    });

    if (!materiels) {
      return { success: false, message: "erreur lors de la suppression" };
    }

    return { success: true, message: "tout est bon", materiels };
  } catch (error) {
    console.error("Erreur lors de la suppression du materiel:", error);
    return {
      success: false,
      message: "Erreur lors de la suppression du materiel",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
