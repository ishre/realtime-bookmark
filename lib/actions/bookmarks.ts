"use server";

import type { Database } from "@/lib/types/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

export async function getBookmarksServer(): Promise<Bookmark[]> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []) as Bookmark[];
}
