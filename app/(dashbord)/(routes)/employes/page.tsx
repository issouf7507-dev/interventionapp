"use client";
import React, { useState } from "react";
import Header from "@/app/components/header";
import { Button } from "@/app/components/ui/button";

import CustomDialog from "@/app/components/_comp/CustomDialog";
import { DataTable } from "./table/data-table";
import { columns, Employes } from "./table/columns";
import EmployeeForm from "@/app/components/form/employee-form";
import { useQuery } from "@tanstack/react-query";
import { getAllEmployees } from "@/app/actions/employeaction";

function Page() {
  const [openD, setOpenD] = useState(false);

  const queryallemployees = useQuery({
    queryKey: ["allemployees"],
    queryFn: getAllEmployees,
  });

  console.log(queryallemployees.data);

  return (
    <div>
      <Header title="Employés" />
      <div className="px-5">
        <Button onClick={() => setOpenD(true)}>
          <p className="text-sm">Nouveau</p>+
        </Button>
      </div>

      <div className="px-5 mt-10">
        <DataTable
          columns={columns(queryallemployees)}
          data={
            queryallemployees.data?.success === false
              ? []
              : (queryallemployees.data?.employees as Employes[]) ?? []
          }
        />
      </div>

      <CustomDialog
        openD={openD}
        setOpenD={setOpenD}
        title="Ajouter un employé"
      >
        <div>
          <EmployeeForm
            openD={openD}
            setOpenD={setOpenD}
            // querytypes={querytypes}
            queryemployees={queryallemployees && queryallemployees}
          />
        </div>
      </CustomDialog>
    </div>
  );
}

export default Page;
