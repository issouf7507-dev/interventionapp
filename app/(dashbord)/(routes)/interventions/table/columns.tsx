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
import { format } from "date-fns";

import { EtatIntervention } from "@/app/components/etat-intervention";
import CustomDialogRepport from "@/app/components/_comp/CustomDialogRepport";
import CustomDialogMin from "@/app/components/_comp/CustomDialogMin";

// Type défini pour les interventions
export type Intervention = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: string;
  latitude: number;
  longitude: number;
  placeId: string;
  postalCode: string;
  region: string;
  country: string;
  clientId: string;
  selectionType: string;
  interventionTypeId: string;
  createdAt: Date;
  updatedAt: Date;
  client?: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };

  interventionType?: {
    name: string;
  };

  teamlId: string;
  team?: {
    createdAt: string;
    description: string;

    employees: Array<{
      id: string;
      idEmployee: string;
      idTeam: string;
    }>;

    id: string;
    name: string;
    updatedAt: string;
  };

  employees: Array<{
    id: string;
    employee: {
      firstName: string;
      lastName: string;
      email?: string;
      phoneNumber?: string;
    };
  }>;
  materials: Array<{
    id: string;
    material: {
      name: string;
      description?: string;
    };
    quantity: number;
  }>;
  states?: Array<{
    id: string;
    type: "BEFORE" | "AFTER";
    description: string;
    createdAt: Date;
    photos: Array<{
      id: string;
      url: string;
    }>;
  }>;
};

export const columns = (
  queryAllInterventions: UseQueryResult<any, Error>
): ColumnDef<Intervention>[] => [
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "location",
    header: "Emplacement",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let statusColor = "";

      switch (status) {
        case "PENDING":
          statusColor = "bg-yellow-200 text-yellow-800 text-[12px]";
          break;
        case "IN_PROGRESS":
          statusColor = "bg-blue-200 text-blue-800 text-[12px]";
          break;
        case "COMPLETED":
          statusColor = "bg-green-200 text-green-800 text-[12px]";
          break;
        case "CANCELLED":
          statusColor = "bg-red-200 text-red-800 text-[12px]";
          break;
        default:
          statusColor = "bg-gray-200 text-gray-800 text-[12px]";
      }

      return (
        <div
          className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${statusColor}`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "client.name",
    header: "Client",
    cell: ({ row }) => {
      const intervention = row.original;
      return intervention.client?.name || "N/A";
    },
  },
  {
    accessorKey: "startDate",
    header: "Date début",
    cell: ({ row }) => {
      const date = row.original.startDate;
      if (!date) return "N/A";
      return format(new Date(date), "dd/MM/yyyy");
    },
  },
  {
    accessorKey: "endDate",
    header: "Date fin",
    cell: ({ row }) => {
      const date = row.original.endDate;
      if (!date) return "N/A";
      return format(new Date(date), "dd/MM/yyyy");
    },
  },
  {
    accessorKey: "employees",
    header: "Techniciens",
    cell: ({ row }) => {
      const employees = row.original.employees;
      if (!employees || employees.length === 0) return "N/A";

      // Afficher les 2 premiers techniciens + "et X autres" si plus de 2
      const displayedEmployees = employees.slice(0, 2);
      const remainingCount = employees.length - 2;

      return (
        <div>
          {displayedEmployees
            .map(
              (item) => `${item.employee.firstName} ${item.employee.lastName}`
            )
            .join(", ")}
          {remainingCount > 0 && ` et ${remainingCount} autres`}
        </div>
      );
    },
  },

  {
    accessorKey: "team.name",
    header: "Equipe",
    cell: ({ row }) => {
      const intervention = row.original;
      return intervention.team?.name || "N/A";
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const intervention = row.original;
      const [openD, setOpenD] = useState(false);
      const [openUpdate, setOpenUpdate] = useState(false);
      const [openDAlert, setOpenDAlert] = useState(false);
      const [openReport, setOpenReport] = useState(false);

      const handleDelete = async (id: string) => {
        // Implémenter la suppression d'une intervention ici
        // deleteIntervention(id);
        queryAllInterventions.refetch();
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
                  // setOpenD(true);
                  setOpenUpdate(true);

                  console.log(intervention);
                }}
              >
                Mettre à jour
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenReport(true);
                }}
              >
                Détails
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenDAlert(true);
                }}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CustomDialog
            openD={openD}
            setOpenD={setOpenD}
            title="Détails de l'intervention"
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Titre</h3>
                <p>{intervention.title}</p>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p>{intervention.description}</p>
              </div>
              <div>
                <h3 className="font-medium">Emplacement</h3>
                <p>{intervention.location}</p>
              </div>
              <div>
                <h3 className="font-medium">Dates</h3>
                <p>
                  Du {format(new Date(intervention.startDate), "dd/MM/yyyy")} au{" "}
                  {format(new Date(intervention.endDate), "dd/MM/yyyy")}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Techniciens</h3>
                <ul className="list-disc pl-5">
                  {intervention.employees.map((item) => (
                    <li key={item.id}>
                      {item.employee.firstName} {item.employee.lastName}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium">Matériels</h3>
                <ul className="list-disc pl-5">
                  {intervention.materials.map((item) => (
                    <li key={item.id}>
                      {item.material.name} (Qté: {item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CustomDialog>

          <CustomDialog
            openD={openUpdate}
            setOpenD={setOpenUpdate}
            title="Détails de l'intervention"
          >
            <div className="space-y-4">
              <EtatIntervention
                openUpdate={openUpdate}
                setOpenUpdate={setOpenUpdate}
                intervention={intervention}
                queryAllInterventions={
                  queryAllInterventions && queryAllInterventions
                }
              />
              <div></div>
            </div>
          </CustomDialog>

          {/* Rapport d'intervention Dialog */}
          <CustomDialogRepport
            openD={openReport}
            setOpenD={setOpenReport}
            title="Rapport d'intervention"
          >
            <div className="space-y-6 max-h-[80vh] overflow-y-auto p-2">
              {/* En-tête du rapport */}
              <div className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{intervention.title}</h1>
                    <p className="text-muted-foreground">
                      {intervention.description}
                    </p>
                  </div>
                  <div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                        intervention.status === "PENDING"
                          ? "bg-yellow-200 text-yellow-800"
                          : intervention.status === "IN_PROGRESS"
                          ? "bg-blue-200 text-blue-800"
                          : intervention.status === "COMPLETED"
                          ? "bg-green-200 text-green-800"
                          : intervention.status === "CANCELLED"
                          ? "bg-red-200 text-red-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {intervention.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations générales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">
                    Informations générales
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-muted-foreground">Localisation:</div>
                    <div>{intervention.location}</div>

                    <div className="text-muted-foreground">Date de début:</div>
                    <div>
                      {format(
                        new Date(intervention.startDate),
                        "dd/MM/yyyy à HH:mm"
                      )}
                    </div>

                    <div className="text-muted-foreground">Date de fin:</div>
                    <div>
                      {format(
                        new Date(intervention.endDate),
                        "dd/MM/yyyy à HH:mm"
                      )}
                    </div>

                    <div className="text-muted-foreground">Créée le:</div>
                    <div>
                      {format(new Date(intervention.createdAt), "dd/MM/yyyy")}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Informations client</h2>
                  {intervention.client ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-muted-foreground">Nom:</div>
                      <div>{intervention.client.name}</div>

                      {intervention.client.email && (
                        <>
                          <div className="text-muted-foreground">Email:</div>
                          <div>{intervention.client.email}</div>
                        </>
                      )}

                      {intervention.client.phone && (
                        <>
                          <div className="text-muted-foreground">
                            Téléphone:
                          </div>
                          <div>{intervention.client.phone}</div>
                        </>
                      )}

                      {intervention.client.address && (
                        <>
                          <div className="text-muted-foreground">Adresse:</div>
                          <div>{intervention.client.address}</div>
                        </>
                      )}
                    </div>
                  ) : (
                    <p>Information client non disponible</p>
                  )}
                </div>
              </div>

              {/* Techniciens */}
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Techniciens assignés
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {intervention.employees.map((tech) => (
                    <div key={tech.id} className="border rounded-md p-3">
                      <p className="font-medium">
                        {tech.employee.firstName} {tech.employee.lastName}
                      </p>
                      {tech.employee.email && (
                        <p className="text-sm text-muted-foreground">
                          {tech.employee.email}
                        </p>
                      )}
                      {tech.employee.phoneNumber && (
                        <p className="text-sm text-muted-foreground">
                          {tech.employee.phoneNumber}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matériels */}
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Matériels utilisés
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {intervention.materials.map((mat) => (
                    <div key={mat.id} className="border rounded-md p-3">
                      <div className="flex justify-between">
                        <p className="font-medium">{mat.material.name}</p>
                        <span className="text-sm bg-slate-100 px-2 py-0.5 rounded">
                          Qté: {mat.quantity}
                        </span>
                      </div>
                      {mat.material.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {mat.material.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* États et Photos */}
              {intervention.states && intervention.states.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    États de l'intervention
                  </h2>
                  <div className="space-y-4">
                    {intervention.states.map((state) => (
                      <div key={state.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">
                            {state.type === "BEFORE"
                              ? "État initial"
                              : "État final"}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            {format(
                              new Date(state.createdAt),
                              "dd/MM/yyyy à HH:mm"
                            )}
                          </span>
                        </div>
                        <p className="mb-3">{state.description}</p>

                        {state.photos && state.photos.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Photos ({state.photos.length})
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {state.photos.map((photo) => (
                                <a
                                  key={photo.id}
                                  href={photo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block h-24 md:h-32 overflow-hidden rounded border hover:opacity-90 transition-opacity"
                                >
                                  <img
                                    src={photo.url}
                                    alt={`Photo ${state.type}`}
                                    className="w-full h-full object-cover"
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CustomDialogRepport>

          <CustomDialogAlert
            openDAlert={openDAlert}
            setOpenDAlert={setOpenDAlert}
            title="Supprimer une intervention"
            description="Voulez-vous vraiment supprimer cette intervention ?"
          >
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(intervention.id)}>
              Confirmer
            </AlertDialogAction>
          </CustomDialogAlert>
        </div>
      );
    },
  },
];
