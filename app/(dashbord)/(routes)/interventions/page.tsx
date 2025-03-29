"use client";
import React, { useState } from "react";

import Header from "@/app/components/header";
import { Button } from "@/app/components/ui/button";

import {
  Calendar,
  CalendarPrevTrigger,
  CalendarCurrentDate,
  CalendarViewTrigger,
  CalendarNextTrigger,
  CalendarTodayTrigger,
  CalendarDayView,
  CalendarWeekView,
  CalendarMonthView,
  CalendarYearView,
} from "@/app/components/full-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CustomDialog from "@/app/components/_comp/CustomDialog";
import { InterventionForm } from "@/app/components/intervention-form";
import { useQuery } from "@tanstack/react-query";
import { columns, Intervention } from "./table/columns";
import { DataTable } from "./table/data-table";
import { fetchData } from "@/utils/utilts";
import AddressAutocomplete from "@/app/components/form/google";
import { LocationData } from "@/app/components/form/google";
import LocationAutocomplete from "@/app/components/form/mailbox";

function Page() {
  const [openD, setOpenD] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const [activeTab, setActiveTab] = useState("Liste des interventions");

  const [listTab, setListTab] = useState([
    {
      id: 1,
      title: "Liste des interventions",
    },
    {
      id: 2,
      title: "Calendrier des interventions",
    },
  ]);

  const queryallclients = useQuery({
    queryKey: ["allclinets2"],
    queryFn: () => fetchData("/api/clients"),
  });

  const queryallemployees = useQuery({
    queryKey: ["allemployees2"],
    queryFn: () => fetchData("/api/technicients"),
  });

  const queryallmaterials = useQuery({
    queryKey: ["queryallmaterials2"],
    queryFn: () => fetchData("/api/materiels"),
  });

  const queryinterventiontypes = useQuery({
    queryKey: ["querytypesaw2"],
    queryFn: () => fetchData("/api/type-inter"),
  });

  const queryallinterventions = useQuery({
    queryKey: ["queryallinterventions2"],
    queryFn: () => fetchData("/api/interventions"),
  });

  const queryallteams = useQuery({
    queryKey: ["allclinets"],
    queryFn: () => fetchData("/api/teams"),
  });

  // console.log(queryallinterventions.data?.data);

  return (
    <div>
      <Header title="Interventions" />
      <div className="px-5 flex justify-between">
        <div>
          <Button onClick={() => setOpenD(true)}>+</Button>
        </div>

        <div className="dark:bg-neutral-800 bg-gray-200 rounded-lg p-1">
          <div className="flex items-center gap-2 justify-center">
            {listTab.map((item) => (
              <div
                key={item.id}
                className={`p-1 rounded-lg cursor-pointer ${
                  activeTab == item.title ? "dark:bg-neutral-950 bg-white" : ""
                }`}
                onClick={() => setActiveTab(item.title)}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <div className="px-5 mt-10">
        <MyCalendar onSelectEvent={handleEventSelect} />
      </div> */}
      {activeTab == "Liste des interventions" ? (
        <div className="px-5 mt-10">
          {/* <MyCalendar onSelectEvent={handleEventSelect} /> */}
          <div className="px-5 mt-10">
            <DataTable
              columns={columns(queryallinterventions)}
              data={
                queryallinterventions.data?.success === false
                  ? []
                  : (queryallinterventions.data?.data as Intervention[]) ?? []
              }
            />
          </div>
        </div>
      ) : (
        <div className="px-5 mt-10">
          <Calendar
            events={(queryallinterventions.data?.data as Intervention[]) ?? []}
          >
            <div className="h-dvh py-6 flex flex-col">
              <div className="flex px-6 items-center gap-2 mb-6">
                <CalendarViewTrigger
                  className="aria-[current=true]:bg-accent"
                  view="day"
                >
                  Day
                </CalendarViewTrigger>
                <CalendarViewTrigger
                  view="week"
                  className="aria-[current=true]:bg-accent"
                >
                  Week
                </CalendarViewTrigger>
                <CalendarViewTrigger
                  view="month"
                  className="aria-[current=true]:bg-accent"
                >
                  Month
                </CalendarViewTrigger>
                <CalendarViewTrigger
                  view="year"
                  className="aria-[current=true]:bg-accent"
                >
                  Year
                </CalendarViewTrigger>

                <span className="flex-1" />

                <CalendarCurrentDate />

                <CalendarPrevTrigger>
                  <ChevronLeft size={20} />
                  <span className="sr-only">Previous</span>
                </CalendarPrevTrigger>

                <CalendarTodayTrigger>Today</CalendarTodayTrigger>

                <CalendarNextTrigger>
                  <ChevronRight size={20} />
                  <span className="sr-only">Next</span>
                </CalendarNextTrigger>

                {/* <ModeToggle /> */}
              </div>

              <div className="flex-1 overflow-auto px-6 relative">
                <CalendarDayView />
                <CalendarWeekView />
                <CalendarMonthView />
                <CalendarYearView />
              </div>
            </div>
          </Calendar>
        </div>
      )}
      <CustomDialog
        openD={openD}
        setOpenD={setOpenD}
        title="Ajouter une intervention"
      >
        <div>
          <InterventionForm
            openD={openD}
            setOpenD={setOpenD}
            clients={queryallclients && queryallclients}
            interventionTypes={queryinterventiontypes && queryinterventiontypes}
            employees={queryallemployees && queryallemployees}
            materials={queryallmaterials && queryallmaterials}
            queryallinterventions={
              queryallinterventions && queryallinterventions
            }
            queryallteams={queryallteams && queryallteams}
          />
        </div>
      </CustomDialog>
    </div>
  );
}

export default Page;
