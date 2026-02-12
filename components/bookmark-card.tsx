"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Archive,
  ArchiveRestore,
  Trash2,
  ExternalLink,
  MoreHorizontal,
  Copy,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Database } from "@/lib/types/database.types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

interface LinkMetadataResponse {
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  domain: string;
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  onToggleFavorite: (id: string, next: boolean) => void;
  onToggleArchive: (id: string, next: boolean) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string, url: string) => void;
  onPositionChange?: (id: string, x: number, y: number) => void;
  onDrag?: (id: string, x: number, y: number) => void;
  isDraggable: boolean;
  livePosition?: { x: number; y: number } | null;
}

function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

export function BookmarkCard({
  bookmark,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
  onOpen,
  isDraggable: _isDraggable,
  livePosition: _livePosition,
}: BookmarkCardProps) {
  const [faviconError, setFaviconError] = useState<boolean>(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const domain: string =
    bookmark.domain ??
    new URL(bookmark.url).hostname.replace(/^www\./, "");

  useEffect(() => {
    let isCancelled: boolean = false;

    async function fetchPreviewImage(): Promise<void> {
      try {
        const response: Response = await fetch(
          `/api/metadata?url=${encodeURIComponent(bookmark.url)}`,
        );
        if (!response.ok) return;

        const data: LinkMetadataResponse =
          (await response.json()) as LinkMetadataResponse;
        if (!isCancelled && data.image) {
          setPreviewImageUrl(data.image);
        }
      } catch {
        // Ignore metadata errors; card will show fallback artwork.
      }
    }

    void fetchPreviewImage();

    return function cleanup(): void {
      isCancelled = true;
    };
  }, [bookmark.url]);

  const handleCopyUrl = (): void => {
    void navigator.clipboard.writeText(bookmark.url);
    toast.success("Link copied to clipboard");
  };

  const handleFavorite = (): void => {
    onToggleFavorite(bookmark.id, !bookmark.is_favorite);
    toast.success(
      bookmark.is_favorite ? "Removed from favorites" : "Added to favorites"
    );
  };

  const handleArchive = (): void => {
    onToggleArchive(bookmark.id, !bookmark.is_archived);
    toast.success(
      bookmark.is_archived ? "Restored from archive" : "Moved to archive"
    );
  };

  const handleDelete = (): void => {
    onDelete(bookmark.id);
    toast.success("Bookmark deleted");
  };

  const handleOpen = (): void => {
    onOpen(bookmark.id, bookmark.url);
  };

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0 },
      }}
      exit={{ opacity: 0, scale: 0.96 }}
      layout
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200",
        "hover:border-border/80 hover:shadow-md hover:shadow-black/[0.04] dark:hover:shadow-black/20"
      )}
    >
      {/* Clickable image area */}
      <button
        type="button"
        onClick={handleOpen}
        className="relative block aspect-[2.4/1] w-full overflow-hidden bg-muted text-left"
      >
        {previewImageUrl ? (
          <img
            src={previewImageUrl}
            alt={bookmark.title}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(): void => {
              setPreviewImageUrl(null);
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Globe className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/5 dark:group-hover:bg-black/20">
          <span className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:opacity-100">
            <ExternalLink className="h-3 w-3" />
            Open
          </span>
        </div>
      </button>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        {/* Domain + Time */}
        <div className="mb-1.5 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {!faviconError && bookmark.favicon_url ? (
              <img
                src={bookmark.favicon_url}
                alt=""
                width={14}
                height={14}
                className="rounded-sm"
                loading="lazy"
                onError={() => setFaviconError(true)}
              />
            ) : !faviconError ? (
              <img
                src={getFaviconUrl(domain)}
                alt=""
                width={14}
                height={14}
                className="rounded-sm"
                loading="lazy"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="text-xs font-medium text-muted-foreground">
              {domain}
            </span>
          </div>
          <span className="text-xs text-muted-foreground/60">&middot;</span>
          <span className="text-xs text-muted-foreground/60">
            {formatDate(bookmark.created_at)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-1 text-sm font-semibold leading-snug text-foreground line-clamp-2">
          <button
            type="button"
            onClick={handleOpen}
            className="text-left hover:underline decoration-foreground/20 underline-offset-2"
          >
            {bookmark.title}
          </button>
        </h3>

        {/* Description */}
        {bookmark.description && (
          <p className="mb-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {bookmark.description}
          </p>
        )}

        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {bookmark.tags.slice(0, 3).map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-md px-1.5 py-0 text-[10px] font-medium"
              >
                {tag}
              </Badge>
            ))}
            {bookmark.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{bookmark.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-1.5">
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7",
                    bookmark.is_favorite
                      ? "text-red-500 hover:text-red-600"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={handleFavorite}
                >
                  <Heart
                    className={cn(
                      "h-3.5 w-3.5",
                      bookmark.is_favorite && "fill-current"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {bookmark.is_favorite
                  ? "Remove from favorites"
                  : "Add to favorites"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={handleArchive}
                >
                  {bookmark.is_archived ? (
                    <ArchiveRestore className="h-3.5 w-3.5" />
                  ) : (
                    <Archive className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {bookmark.is_archived ? "Restore" : "Archive"}
              </TooltipContent>
            </Tooltip>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={handleCopyUrl}
                className="gap-2 text-sm"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleOpen}
                className="gap-2 text-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open in new tab
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="gap-2 text-sm text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.article>
  );
}
