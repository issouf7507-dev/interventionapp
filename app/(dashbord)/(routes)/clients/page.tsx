"use client";
import CustomDialog from "@/app/components/_comp/CustomDialog";
import ClientForm from "@/app/components/form/client-form";
import Header from "@/app/components/header";
import { Button } from "@/app/components/ui/button";
import React, { useState } from "react";
import { Clients, columns } from "./table/columns";
import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "@/app/actions/clientaction";
import { DataTable } from "./table/data-table";
import { fetchData } from "@/utils/utilts";

const Page = () => {
  const [openD, setOpenD] = useState(false);

  const queryallclients = useQuery({
    queryKey: ["allclinets"],
    queryFn: () => fetchData("/api/clients"),
  });

  console.log(queryallclients.data);

  return (
    <div>
      <Header title="Clients" />
      <div className="px-5">
        <Button onClick={() => setOpenD(true)}>
          <p className="text-sm">Nouveau</p>+
        </Button>
      </div>

      <div className="px-5 mt-10">
        <DataTable
          columns={columns(queryallclients)}
          data={
            queryallclients.data?.success === false
              ? []
              : (queryallclients.data?.data as Clients[]) ?? []
          }
        />
      </div>

      <CustomDialog openD={openD} setOpenD={setOpenD} title="Ajouter un client">
        <div>
          <ClientForm
            openD={openD}
            setOpenD={setOpenD}
            // initialData={data}
            queryclients={queryallclients && queryallclients}
          />
        </div>
      </CustomDialog>
    </div>
  );
};

export default Page;
