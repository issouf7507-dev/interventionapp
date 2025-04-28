"use client";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// smsm

const queryClient = new QueryClient();
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <div>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <div>{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </SessionProvider>
    </QueryClientProvider>
  );
}
