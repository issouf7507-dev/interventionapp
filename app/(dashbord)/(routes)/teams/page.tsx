"use client";
import { getAllEmployees } from "@/app/actions/employeaction";
import CustomDialog from "@/app/components/_comp/CustomDialog";
import TeamsForm from "@/app/components/form/teams-form";
import Header from "@/app/components/header";
import { Button } from "@/app/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { DataTable } from "./table/data-table";
import { columns, Teams } from "./table/columns";
import { fetchData } from "@/utils/utilts";

const Page = () => {
  const [openD, setOpenD] = useState(false);

  const queryallemployees = useQuery({
    queryKey: ["allemployees2"],
    queryFn: () => fetchData("/api/technicients"),
  });

  const queryallteams = useQuery({
    queryKey: ["allclinets"],
    queryFn: () => fetchData("/api/teams"),
  });

  // console.log(queryallteams?.data);

  return (
    <div>
      <Header title="Equipes" />
      <div className="px-5">
        <Button onClick={() => setOpenD(true)}>
          <p className="text-sm">Nouveau</p>+
        </Button>
      </div>

      <div className="px-5 mt-10">
        <DataTable
          columns={columns(queryallteams, queryallemployees)}
          data={
            queryallteams.data?.success === false
              ? []
              : (queryallteams.data?.data as Teams[]) ?? []
          }
        />
      </div>

      <CustomDialog
        openD={openD}
        setOpenD={setOpenD}
        title="Ajouter une equipe"
      >
        <div>
          <TeamsForm
            openD={openD}
            setOpenD={setOpenD}
            // initialData={queryallteams.data}
            employees={queryallemployees && queryallemployees}
            queryteams={queryallteams && queryallteams}
          />
        </div>
      </CustomDialog>
    </div>
  );
};

export default Page;
