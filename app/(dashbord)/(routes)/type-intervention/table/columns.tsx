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
import CustomDialog from "@/app/components/_comp/CustomDialog";
import { useState } from "react";
import CustomDialogAlert from "@/app/components/_comp/CustomDialogAlert";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@/app/components/ui/alert-dialog";

import { useRefetch } from "@/provider/RefetchContext";
import { UseQueryResult } from "@tanstack/react-query";
import { deleteInterventionType } from "@/app/actions/interventiontypeaction";
import TypeInterventionForm from "@/app/components/form/type-inter-form";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type InterventionType = {
  id: String;
  name: String;
  description: String;
};

export const columns = (
  queryinterventiontypes: UseQueryResult<any | Error>
): ColumnDef<InterventionType>[] => [
  { accessorKey: "name", header: "Nom" },
  { accessorKey: "description", header: "Description" },
  {
    id: "actions",
    cell: ({ row }) => {
      const datarow = row.original;
      const [openD, setOpenD] = useState(false);
      const [openDAlert, setOpenDAlert] = useState(false);
      const [data, setData] = useState<InterventionType | null>(null);

      const handleDelete = (id: string) => {
        deleteInterventionType(id);
        console.log(id);
        queryinterventiontypes.refetch();
      };

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
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
              <DropdownMenuItem onClick={() => setOpenDAlert(true)}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CustomDialog
            openD={openD}
            setOpenD={setOpenD}
            title="  Modifier un type d'employé"
          >
            <TypeInterventionForm
              openD={openD}
              setOpenD={setOpenD}
              initialData={data}
              queryinterventiontypes={
                queryinterventiontypes && queryinterventiontypes
              }
            />
          </CustomDialog>

          <CustomDialogAlert
            openDAlert={openDAlert}
            setOpenDAlert={setOpenDAlert}
            title="Supprimer un type d'employé"
            description="Voulez-vous vraiment supprimer ce type d'employé ?"
          >
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(datarow.id as string)}
            >
              Continue
            </AlertDialogAction>
          </CustomDialogAlert>
        </div>
      );
    },
  },
];
