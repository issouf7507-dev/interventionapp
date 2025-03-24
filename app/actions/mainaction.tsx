"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

// create type
export async function createType({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
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

    const type = await prisma.employeeType.create({
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

export const updateType = async (
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
    const type = await prisma.employeeType.update({
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
export async function getAllTypes() {
  try {
    const types = await prisma.employeeType.findMany();
    return { success: true, types };
  } catch (error) {
    return { success: false, message: "Failed to get types" };
  }
}

// delete type
export const deleteTypess = async (id: string) => {
  try {
    const type = await prisma.employeeType.delete({
      where: { id },
    });

    if (!type) {
      throw new Error("Failed to delete type");
    }

    console.log(id);

    return { success: true, message: "Type deleted successfully" };
  } catch (error) {
    return { success: false, message: "Failed to delete type" };
  }
};
