"use client";
import React, { useState } from "react";
import Header from "@/app/components/header";
import { Button } from "@/app/components/ui/button";
import CustomDialog from "@/app/components/_comp/CustomDialog";
import { columns, EmployesT } from "./table/columns";
import { DataTable } from "./table/data-table";
// import TypeEmployeForm from "@/app/components/form/type-employe-form";
import { useQuery } from "@tanstack/react-query";
import { getAllTypes } from "@/app/actions/mainaction";
import { RefetchContext } from "@/provider/RefetchContext";
import TypeEmployeForm from "@/app/components/form/type-employe-form";

const data: EmployesT[] = [
  {
    id: "728ed52f",
    name: "John",
    description: "Doe",
  },
  // ...
];

function Page() {
  const querytypes = useQuery({
    queryKey: ["querytypes"],
    queryFn: getAllTypes,
  });

  const [openD, setOpenD] = useState(false);
  const [openDAlert, setOpenDAlert] = useState(false);
  const [editingData, setEditingData] = useState<EmployesT | null>(null);

  return (
    <div>
      <Header title="Type d'employés" />
      <div className="px-5">
        <Button onClick={() => setOpenD(true)}>
          <p className="text-sm">Nouveau</p>+
        </Button>
      </div>

      <div className="px-5 mt-10">
        <DataTable
          columns={columns(querytypes)}
          data={
            querytypes.data?.success === false
              ? []
              : (querytypes.data?.types as EmployesT[]) ?? []
          }
        />
      </div>

      <CustomDialog
        openD={openD}
        setOpenD={setOpenD}
        title="Ajouter un type d'employé"
      >
        <div>
          <TypeEmployeForm
            openD={openD}
            setOpenD={setOpenD}
            querytypes={querytypes && querytypes}
          />
        </div>
      </CustomDialog>
    </div>
  );
}

export default Page;
