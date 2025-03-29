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

const CustomDialogMin = ({
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
  return (
    <Dialog open={openD} onOpenChange={setOpenD}>
      <DialogContent className={`sm:max-w-[425px]`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialogMin;
