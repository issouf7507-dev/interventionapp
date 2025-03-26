"use client";
import React, { useState } from "react";
import Header from "@/app/components/header";
import { Button } from "@/app/components/ui/button";
import CustomDialog from "@/app/components/_comp/CustomDialog";
import { columns, InterventionType } from "./table/columns";
import { DataTable } from "./table/data-table";

import { useQuery } from "@tanstack/react-query";
import { getAllTypes } from "@/app/actions/mainaction";
import { RefetchContext } from "@/provider/RefetchContext";
import { getAllInterventionTypes } from "@/app/actions/interventiontypeaction";
import TypeInterventionForm from "@/app/components/form/type-inter-form";
import { fetchData } from "@/utils/utilts";

function Page() {
  const queryinterventiontypes = useQuery({
    queryKey: ["querytypesaw"],
    queryFn: () => fetchData("/api/type-inter"),
  });

  const [openD, setOpenD] = useState(false);
  const [openDAlert, setOpenDAlert] = useState(false);
  const [editingData, setEditingData] = useState<InterventionType | null>(null);

  return (
    <div>
      <Header title="Type d'intervention" />
      <div className="px-5">
        <Button onClick={() => setOpenD(true)}>
          <p className="text-sm">Nouveau</p>+
        </Button>
      </div>

      <div className="px-5 mt-10">
        <DataTable
          columns={columns(queryinterventiontypes)}
          data={
            queryinterventiontypes.data?.success === false
              ? []
              : (queryinterventiontypes.data?.data as InterventionType[]) ?? []
          }
        />
      </div>

      <CustomDialog
        openD={openD}
        setOpenD={setOpenD}
        title="Ajouter un type d'employé"
      >
        <div>
          <TypeInterventionForm
            openD={openD}
            setOpenD={setOpenD}
            queryinterventiontypes={
              queryinterventiontypes && queryinterventiontypes
            }
          />
        </div>
      </CustomDialog>
    </div>
  );
}

export default Page;
