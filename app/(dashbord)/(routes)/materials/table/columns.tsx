"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import CustomDialog from "@/app/components/_comp/CustomDialog";

import { UseQueryResult } from "@tanstack/react-query";

import { AlertDialogAction } from "@/app/components/ui/alert-dialog";
import CustomDialogAlert from "@/app/components/_comp/CustomDialogAlert";
import { AlertDialogCancel } from "@/app/components/ui/alert-dialog";
import { deleteMaterial } from "@/app/actions/materielaction";
import MaterialForm from "@/app/components/form/material-form";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Materials = {
  id: string;
  name: string;
  description: string;
  quantity: number;
};

export const columns = (
  queryallmaterials: UseQueryResult<any, Error>
): ColumnDef<Materials>[] => [
  { accessorKey: "name", header: "Nom" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "quantity", header: "Quantité" },

  {
    id: "actions",
    cell: ({ row }) => {
      const datarow = row.original;
      const [openD, setOpenD] = useState(false);
      const [openDAlert, setOpenDAlert] = useState(false);
      const [data, setData] = useState<Materials | null>(null);

      const handleDelete = (id: string) => {
        deleteMaterial(id);
        queryallmaterials.refetch();
      };

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setOpenD(true);
                  setData(datarow);
                }}
              >
                Editer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenDAlert(true);
                  setData(datarow);
                }}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CustomDialog
            openD={openD}
            setOpenD={setOpenD}
            title="Editer un employé"
          >
            <MaterialForm
              openD={openD}
              setOpenD={setOpenD}
              initialData={data}
              querymaterials={queryallmaterials && queryallmaterials}
            />
          </CustomDialog>

          <CustomDialogAlert
            openDAlert={openDAlert}
            setOpenDAlert={setOpenDAlert}
            title="Supprimer un matériel"
            description="Voulez-vous vraiment supprimer ce matériel ?"
          >
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(datarow?.id as string)}
            >
              Continue
            </AlertDialogAction>
          </CustomDialogAlert>
        </div>
      );
    },
  },
];
