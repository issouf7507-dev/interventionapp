"use client";
import CustomDialog from "@/app/components/_comp/CustomDialog";
import Header from "@/app/components/header";
import { Button } from "@/app/components/ui/button";
import React, { useState } from "react";
import { columns, Materials } from "./table/columns";
import { useQuery } from "@tanstack/react-query";
import { getAllMaterial } from "@/app/actions/materielaction";
import { DataTable } from "./table/data-table";
import MaterialForm from "@/app/components/form/material-form";
import { fetchData } from "@/utils/utilts";

const Page = () => {
  const [openD, setOpenD] = useState(false);

  const queryallmaterials = useQuery({
    queryKey: ["queryallmaterials"],
    queryFn: () => fetchData("/api/materiels"),
  });

  return (
    <div>
      <Header title="Materiels" />
      <div className="px-5">
        <Button onClick={() => setOpenD(true)}>
          <p className="text-sm">Nouveau</p>+
        </Button>
      </div>

      <div className="px-5 mt-10">
        <DataTable
          columns={columns(queryallmaterials)}
          data={
            queryallmaterials.data?.success === false
              ? []
              : (queryallmaterials.data?.data as Materials[]) ?? []
          }
        />
      </div>

      <CustomDialog
        openD={openD}
        setOpenD={setOpenD}
        title="Ajouter un materiel"
      >
        <div>
          <MaterialForm
            openD={openD}
            setOpenD={setOpenD}
            querymaterials={queryallmaterials && queryallmaterials}
          />
        </div>
      </CustomDialog>
    </div>
  );
};

export default Page;
