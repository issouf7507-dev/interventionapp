"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetDescription,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

const CustomDrawer = ({
  openD,
  setOpenD,
  children,
}: {
  openD: boolean;
  setOpenD: (openD: boolean) => void;
  children: React.ReactNode;
}) => {
  return (
    <Sheet open={openD} onOpenChange={setOpenD}>
      {/* <SheetContent>
        <div>{children}</div>
      </SheetContent> */}
      <SheetContent className="w-[1100px]">
        <SheetHeader>
          <SheetTitle>Détails de l'intervention</SheetTitle>
          <SheetDescription>Détails de l'intervention</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomDrawer;
