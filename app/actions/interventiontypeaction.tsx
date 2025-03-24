"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

// create type
export async function createInterventionType({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  try {
    // Check if the type with the same name already exists
    const existingType = await prisma.interventionType.findUnique({
      where: {
        name,
      },
    });

    if (existingType) {
      return {
        success: false,
        message: "Le nom doit être unique. Ce nom existe déjà.",
      };
    }

    const type = await prisma.interventionType.create({
      data: {
        name,
        description,
      },
    });

    if (!type) {
      throw new Error("Failed to create type");
    }
    return { success: true, message: "Type created successfully" };
  } catch (error) {
    return { success: false, message: "Failed to create type" };
  }
}

export const updateInterventionType = async (
  id: string,
  name: string,
  description: string
) => {
  try {
    // Check if the type with the same name already exists
    const existingType = await prisma.employeeType.findUnique({
      where: {
        name,
      },
    });

    if (existingType) {
      return {
        success: false,
        message: "Le nom doit être unique. Ce nom existe déjà.",
      };
    }
    const type = await prisma.interventionType.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    if (!type) {
      throw new Error("Failed to update type");
    }

    return { success: true, message: "Type updated successfully" };
  } catch (error) {
    return { success: false, message: "Failed to update type" };
  }
};

// get all types
export async function getAllInterventionTypes() {
  try {
    const types = await prisma.interventionType.findMany();
    return { success: true, types };
  } catch (error) {
    return { success: false, message: "Failed to get types" };
  }
}

// delete type
export const deleteInterventionType = async (id: string) => {
  try {
    const type = await prisma.interventionType.delete({
      where: { id },
    });

    if (!type) {
      throw new Error("Failed to delete type");
    }

    return { success: true, message: "Type deleted successfully" };
  } catch (error) {
    return { success: false, message: "Failed to delete type" };
  }
};
