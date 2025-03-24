"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { usePathname } from "next/navigation";

const CustomDialog = ({
  openD,
  setOpenD,
  children,
  title,
  description,
}: {
  openD: boolean;
  setOpenD: (openD: boolean) => void;
  children: React.ReactNode;
  title: string;
  description?: string;
}) => {
  const pathname = usePathname();
  return (
    <Dialog open={openD} onOpenChange={setOpenD}>
      <DialogContent
        className={`  ${
          pathname === "/interventions"
            ? "max-w-[600px] h-full overflow-y-auto"
            : "sm:max-w-[425px]"
        } overflow-y-auto `}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
