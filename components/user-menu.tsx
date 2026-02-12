"use client";

import Image from "next/image";
import { useTransition } from "react";
import { LogOut, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface UserMenuProps {
  userName: string;
  userEmail: string;
  userAvatarUrl?: string;
}

export function UserMenu({
  userName,
  userEmail,
  userAvatarUrl = "",
}: UserMenuProps) {
  const [isPending, startTransition] = useTransition();

  const initials: string =
    userName
      .split(" ")
      .map((part: string) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") || "U";

  const handleSignOut = (): void => {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      window.location.href = "/login";
    });
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
      <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
        {userAvatarUrl ? (
          <Image
            src={userAvatarUrl}
            alt={userName || "Profile"}
            width={32}
            height={32}
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
            {initials}
          </span>
        )}
      </div>
      <div className="hidden flex-col leading-tight sm:flex">
        <span className="text-xs font-medium text-foreground">
          {userName || "User"}
        </span>
        <span className="text-[11px] text-muted-foreground">{userEmail}</span>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleSignOut}
            disabled={isPending}
            aria-label="Sign out"
            className="ml-1 h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            {isPending ? (
              <User2 className="h-4 w-4 animate-pulse" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sign out</TooltipContent>
      </Tooltip>
    </div>
  );
}
