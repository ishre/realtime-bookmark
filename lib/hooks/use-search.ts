"use client";

import { useMemo, useState } from "react";
import debounce from "lodash/debounce";
import type { Database } from "@/lib/types/database.types";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
type BookmarkView = "all" | "favorites" | "archived";

interface UseSearchResult {
  filteredBookmarks: Bookmark[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function useSearch(
  bookmarks: Bookmark[],
  view: BookmarkView,
): UseSearchResult {
  const [searchQuery, setSearchQueryState] = useState<string>("");

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQueryState(value);
      }, 300),
    [],
  );

  const setSearchQuery = (value: string): void => {
    debouncedSetSearch(value);
  };

  const filteredBookmarks: Bookmark[] = useMemo(() => {
    const seen = new Set<string>();
    const deduped = bookmarks.filter((b: Bookmark) => {
      if (seen.has(b.id)) return false;
      seen.add(b.id);
      return true;
    });
    let results: Bookmark[] = deduped;

    if (view === "favorites") {
      results = results.filter((bookmark: Bookmark) => bookmark.is_favorite);
    }

    if (view === "archived") {
      results = results.filter((bookmark: Bookmark) => bookmark.is_archived);
    }

    if (searchQuery) {
      const query: string = searchQuery.toLowerCase();
      results = results.filter((bookmark: Bookmark) => {
        const matchesTitle: boolean = bookmark.title
          .toLowerCase()
          .includes(query);
        const matchesUrl: boolean = bookmark.url.toLowerCase().includes(query);
        const matchesDescription: boolean =
          bookmark.description?.toLowerCase().includes(query) ?? false;
        const matchesTag: boolean =
          bookmark.tags?.some((tag: string) =>
            tag.toLowerCase().includes(query),
          ) ?? false;

        return (
          matchesTitle ||
          matchesUrl ||
          matchesDescription ||
          matchesTag
        );
      });
    }

    return [...results].sort(
      (a: Bookmark, b: Bookmark) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime(),
    );
  }, [bookmarks, searchQuery, view]);

  return {
    filteredBookmarks,
    searchQuery,
    setSearchQuery,
  };
}

