"use client";

import { useEffect, useState } from "react";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
type BookmarkInsert = Database["public"]["Tables"]["bookmarks"]["Insert"];
type BookmarkUpdate = Database["public"]["Tables"]["bookmarks"]["Update"];

interface UseBookmarksOptions {
  initialBookmarks?: Bookmark[];
}

interface UseBookmarksResult {
  bookmarks: Bookmark[];
  loading: boolean;
  addBookmark: (
    payload: Omit<BookmarkInsert, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  updateBookmark: (id: string, data: BookmarkUpdate) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  visitBookmark: (id: string) => Promise<void>;
}

export function useBookmarks(
  options: UseBookmarksOptions = {},
): UseBookmarksResult {
  const { initialBookmarks = [] } = options;
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [loading, setLoading] = useState<boolean>(initialBookmarks.length === 0);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const setup = async (): Promise<void> => {
      setLoading(initialBookmarks.length === 0);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setBookmarks([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setBookmarks(data as Bookmark[]);
      } else if (initialBookmarks.length > 0) {
        setBookmarks(initialBookmarks);
      }
      setLoading(false);

      channel = supabase
        .channel(`bookmarks-realtime-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
          },
          (payload: RealtimePostgresChangesPayload<Bookmark>) => {
            const newBookmark = payload.new as Bookmark;
            const oldId = (payload.old as { id?: string })?.id;

            if (payload.eventType === "INSERT") {
              setBookmarks((prev: Bookmark[]) => {
                const exists = prev.some((b: Bookmark) => b.id === newBookmark.id);
                if (exists) return prev;
                return [newBookmark, ...prev];
              });
            }
            if (payload.eventType === "UPDATE") {
              setBookmarks((prev: Bookmark[]) =>
                prev.map((b: Bookmark) =>
                  b.id === newBookmark.id ? newBookmark : b,
                ),
              );
            }
            if (payload.eventType === "DELETE") {
              const deletedId = oldId ?? (payload.old as { id: string }).id;
              setBookmarks((prev: Bookmark[]) =>
                prev.filter((b: Bookmark) => b.id !== deletedId),
              );
            }
          },
        )
        .subscribe((status: string) => {
          if (status === "SUBSCRIBED") {
            // Realtime connection ready
          }
        });
    };

    void setup();

    return () => {
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [initialBookmarks.length]);

  const addBookmark = async (
    payload: Omit<BookmarkInsert, "id" | "created_at" | "updated_at">,
  ): Promise<void> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be signed in to add bookmarks");
    }

    const count: number = bookmarks.length;
    const initialX: number = (count % 5) * 260;
    const initialY: number = Math.floor(count / 5) * 240;

    const tempId: string = `temp-${Date.now()}`;
    const optimisticBookmark: Bookmark = {
      ...(payload as Bookmark),
      id: tempId,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      position_x: initialX,
      position_y: initialY,
    };
    setBookmarks((prev: Bookmark[]) => [optimisticBookmark, ...prev]);

    const { error, data } = await supabase
      .from("bookmarks")
      .insert({
        user_id: user.id,
        url: payload.url,
        title: payload.title,
        description: payload.description ?? null,
        tags: payload.tags ?? [],
        favicon_url: payload.favicon_url ?? null,
        is_archived: payload.is_archived ?? false,
        is_favorite: payload.is_favorite ?? false,
        view_count: payload.view_count ?? 0,
        last_accessed_at: payload.last_accessed_at ?? null,
        position_x: initialX,
        position_y: initialY,
      })
      .select()
      .single();

    if (error || !data) {
      setBookmarks((prev: Bookmark[]) =>
        prev.filter((bookmark: Bookmark) => bookmark.id !== tempId),
      );
      throw error ?? new Error("Failed to create bookmark");
    }

    setBookmarks((prev: Bookmark[]) =>
      prev.map((bookmark: Bookmark) =>
        bookmark.id === tempId ? (data as Bookmark) : bookmark,
      ),
    );
  };

  const updateBookmark = async (
    id: string,
    data: BookmarkUpdate,
  ): Promise<void> => {
    const previous: Bookmark | undefined = bookmarks.find(
      (b: Bookmark) => b.id === id,
    );
    if (!previous) return;

    setBookmarks((prev: Bookmark[]) =>
      prev.map((b: Bookmark) => (b.id === id ? { ...b, ...data } : b)),
    );

    const { error } = await supabase
      .from("bookmarks")
      .update(data)
      .eq("id", id);

    if (error) {
      setBookmarks((prev: Bookmark[]) =>
        prev.map((b: Bookmark) => (b.id === id ? previous : b)),
      );
      throw error;
    }
  };

  const deleteBookmark = async (id: string): Promise<void> => {
    const previous: Bookmark | undefined = bookmarks.find(
      (b: Bookmark) => b.id === id,
    );
    if (!previous) return;

    setBookmarks((prev: Bookmark[]) =>
      prev.filter((b: Bookmark) => b.id !== id),
    );

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
      setBookmarks((prev: Bookmark[]) => [previous, ...prev]);
      throw error;
    }
  };

  const visitBookmark = async (id: string): Promise<void> => {
    await supabase.rpc("increment_view_and_last_accessed", {
      bookmark_id: id,
    });
  };

  return {
    bookmarks,
    loading,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    visitBookmark,
  };
}

