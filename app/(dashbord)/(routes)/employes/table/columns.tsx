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

import EmployeeForm from "@/app/components/form/employee-form";
import { UseQueryResult } from "@tanstack/react-query";
import { AlertDialogAction } from "@/app/components/ui/alert-dialog";
import CustomDialogAlert from "@/app/components/_comp/CustomDialogAlert";
import { AlertDialogCancel } from "@/app/components/ui/alert-dialog";
import { deleteEmployee } from "@/app/actions/employeaction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Employes = {
  id: string;
  firstName: String;
  lastName: String;
  email: String;
  phoneNumber: String;
  address: String;
  employeeTypeId: String;
};

export const columns = (
  queryallemployees: UseQueryResult<any, Error>
): ColumnDef<Employes>[] => [
  { accessorKey: "firstName", header: "Prénom" },
  { accessorKey: "lastName", header: "Nom" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phoneNumber", header: "Téléphone" },
  { accessorKey: "address", header: "Adresse" },

  {
    id: "actions",
    cell: ({ row }) => {
      const datarow = row.original;
      const [openD, setOpenD] = useState(false);
      const [openDAlert, setOpenDAlert] = useState(false);
      const [data, setData] = useState<Employes | null>(null);

      const handleDelete = (id: string) => {
        deleteEmployee(id);
        queryallemployees.refetch();
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
            <EmployeeForm
              openD={openD}
              setOpenD={setOpenD}
              initialData={data}
              queryemployees={queryallemployees && queryallemployees}
              // initialData={data}
              // querytypes={querytypes }
            />
          </CustomDialog>

          <CustomDialogAlert
            openDAlert={openDAlert}
            setOpenDAlert={setOpenDAlert}
            title="Supprimer un employé"
            description="Voulez-vous vraiment supprimer ce employé ?"
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
