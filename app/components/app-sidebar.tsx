"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CirclePlus,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  Pickaxe,
  PieChart,
  Settings2,
  SquareTerminal,
  User2,
  UserCog,
  UserPlus,
  UserRoundPen,
  Users,
  Wrench,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

// This is sample data.

const dataMain = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: User2,
      // isActive: true,
    },
    {
      title: "Techniciens",
      url: "/employes",
      icon: UserCog,
      // isActive: true,
    },
    {
      title: "Equipes",
      url: "/teams",
      icon: Users,
      // isActive: true,
    },
    {
      title: "Types de techniciens",
      url: "/type-employes",
      icon: UserRoundPen,
      // <UserRoundPen />
      // isActive: true,
    },
    {
      title: "Materials",
      url: "/materials",
      icon: Wrench,
      // <Wrench />
      // isActive: true,
    },
    {
      title: "Type d'intervention",
      url: "/type-intervention",
      icon: CirclePlus,
      // isActive: true,
    },
    {
      title: "Interventions",
      url: "/interventions",
      icon: Pickaxe,

      // isActive: true,
    },
  ],
};
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "COUV",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mt-5">
          <SidebarMenu>
            {dataMain.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                // defaultOpen={item.isActive}
                className="group/collapsible "
              >
                <SidebarMenuItem className=" z-20 rounded-md">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      {item.icon && (
                        <item.icon
                          className={`${
                            pathname === item.url
                              ? "text-blue-800  rounded-md"
                              : ""
                          }`}
                        />
                      )}
                      <Link
                        href={item.url}
                        className={`font-medium block w-full h-full ${
                          pathname === item.url
                            ? "text-blue-800  rounded-md"
                            : ""
                        }`}
                      >
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
              </Collapsible>
            ))}
            {/* <SidebarMenuItem>
              <SidebarMenuButton>
                <a href="" className="font-medium">
                  item.title
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
          </SidebarMenu>
        </SidebarGroup>
        {/* <NavMain items={data.navMain} /> */}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3">
          <NavUser user={data.user} />
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
