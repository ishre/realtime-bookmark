import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { UserMenu } from "@/components/user-menu";

export const metadata: Metadata = {
  title: "Bookmarks — Dashboard",
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="relative flex-1 overflow-hidden">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 px-6 py-3 backdrop-blur-xl lg:px-8">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Library
            </span>
            <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">
              Your bookmarks
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <UserMenu
              userEmail={user?.email ?? ""}
              userName={user?.user_metadata?.name ?? ""}
              userAvatarUrl={
                (user?.user_metadata?.avatar_url as string) ??
                (user?.user_metadata?.picture as string) ??
                ""
              }
            />
          </div>
        </header>
        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto px-6 py-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
