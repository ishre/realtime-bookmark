"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  Bookmark,
  Heart,
  LayoutGrid,
  Moon,
  Sun,
  Monitor,
  Settings,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLink {
  href: string;
  label: string;
  icon: ReactNode;
}

const links: NavLink[] = [
  {
    href: "/dashboard",
    label: "All Bookmarks",
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  {
    href: "/favorites",
    label: "Favorites",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    href: "/archived",
    label: "Archived",
    icon: <Archive className="h-4 w-4" />,
  },
];

export function Sidebar() {
  const pathname: string = usePathname();
  const { setTheme, theme } = useTheme();

  return (
    <aside className="hidden h-[calc(100vh-1.5rem)] w-[250px] flex-col rounded-2xl border border-sidebar-border bg-sidebar/95 shadow-lg md:flex m-3">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Bookmark className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Bookmarks
        </span>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-3">
        {links.map((link: NavLink) => {
          const isActive: boolean = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "shrink-0 transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div className="border-t border-border px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2.5 px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="gap-2"
            >
              <Sun className="h-4 w-4" />
              Light
              {theme === "light" && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Active
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark
              {theme === "dark" && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Active
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="gap-2"
            >
              <Monitor className="h-4 w-4" />
              System
              {theme === "system" && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Active
                </span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
