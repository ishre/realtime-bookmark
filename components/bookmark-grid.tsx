"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Database } from "@/lib/types/database.types";
import { BookmarkCard } from "@/components/bookmark-card";
import { EmptyState } from "@/components/empty-state";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { useSearch } from "@/lib/hooks/use-search";
import { AddBookmarkDialog } from "@/components/add-bookmark-dialog";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
type BookmarkView = "all" | "favorites" | "archived";

interface BookmarkGridProps {
  view: BookmarkView;
  initialBookmarks?: Bookmark[];
}

export function BookmarkGrid({
  view,
  initialBookmarks = [],
}: BookmarkGridProps) {
  const {
    bookmarks,
    loading,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    visitBookmark,
  } = useBookmarks({ initialBookmarks });
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { filteredBookmarks, searchQuery, setSearchQuery } = useSearch(
    bookmarks,
    view
  );

  const handleOpenDialog = (): void => {
    setIsDialogOpen(true);
  };

  const handleToggleFavorite = (id: string, next: boolean): void => {
    void updateBookmark(id, { is_favorite: next });
  };

  const handleToggleArchive = (id: string, next: boolean): void => {
    void updateBookmark(id, { is_archived: next });
  };

  const handleDelete = (id: string): void => {
    void deleteBookmark(id);
  };

  const handleOpenBookmark = useCallback(
    (id: string, url: string): void => {
      void visitBookmark(id);
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [visitBookmark]
  );

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
  };

  const handleClearSearch = (): void => {
    setSearchQuery("");
  };

  const showEmpty: boolean =
    !loading && filteredBookmarks.length === 0;

  return (
    <section className="relative">
      <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
        />
        <Button
          type="button"
          size="sm"
          className="inline-flex items-center gap-1.5 shadow-sm"
          onClick={handleOpenDialog}
        >
          <Plus className="h-4 w-4" />
          Add bookmark
        </Button>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index: number) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="aspect-[1.91/1] w-full animate-pulse bg-muted" />
              <div className="space-y-3 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 animate-pulse rounded-sm bg-muted" />
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                <div className="flex gap-1.5">
                  <div className="h-5 w-12 animate-pulse rounded-md bg-muted" />
                  <div className="h-5 w-16 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && showEmpty && (
        <EmptyState
          title={
            view === "favorites"
              ? "No favorite bookmarks yet"
              : view === "archived"
                ? "No archived bookmarks"
                : "No bookmarks yet"
          }
          description={
            view === "favorites"
              ? "Star the links you love the most to keep them in easy reach."
              : view === "archived"
                ? "Archive links you are done with but do not want to delete entirely."
                : "Capture and organize your favorite resources in one clean workspace."
          }
          actionLabel="Add your first bookmark"
          onAction={handleOpenDialog}
        />
      )}

      {!loading && !showEmpty && (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.06 } },
          }}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence>
            {filteredBookmarks.map((bookmark: Bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onToggleFavorite={handleToggleFavorite}
                onToggleArchive={handleToggleArchive}
                onDelete={handleDelete}
                onOpen={handleOpenBookmark}
                isDraggable={false}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AddBookmarkDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreate={addBookmark}
      />
    </section>
  );
}
