import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const CustomDialogAlert = ({
  openDAlert,
  setOpenDAlert,
  children,
  title,
  description,
}: {
  openDAlert: boolean;
  setOpenDAlert: (openDAlert: boolean) => void;
  children: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div>
      <AlertDialog open={openDAlert} onOpenChange={setOpenDAlert}>
        {/* <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>{children}</AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomDialogAlert;
