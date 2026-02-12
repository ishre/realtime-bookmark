"use client";

import { useCallback, useState, type FormEvent } from "react";
import { Loader2, Plus, X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/lib/types/database.types";

type BookmarkInsert = Database["public"]["Tables"]["bookmarks"]["Insert"];

interface MetadataResponse {
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  domain: string;
}

interface AddBookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    payload: Omit<BookmarkInsert, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function AddBookmarkDialog({
  open,
  onOpenChange,
  onCreate,
}: AddBookmarkDialogProps) {
  const [url, setUrl] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [metadataFetched, setMetadataFetched] = useState<boolean>(false);

  const resetForm = useCallback((): void => {
    setUrl("");
    setTagInput("");
    setTags([]);
    setIsLoading(false);
    setIsSaving(false);
    setMetadata(null);
    setMetadataFetched(false);
  }, []);

  const handleClose = useCallback(
    (isOpen: boolean): void => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    },
    [onOpenChange, resetForm]
  );

  const fetchMetadata = useCallback(
    async (rawUrl?: string): Promise<void> => {
      const input: string = (rawUrl ?? url).trim();
      if (!input) return;

      let normalizedUrl: string = input;
      if (
        !normalizedUrl.startsWith("http://") &&
        !normalizedUrl.startsWith("https://")
      ) {
        normalizedUrl = `https://${normalizedUrl}`;
        setUrl(normalizedUrl);
      }

      try {
        // Validate URL including special characters
        // URL constructor handles Unicode and query params correctly.
        // This will throw only for structurally invalid URLs.
        // eslint-disable-next-line no-new
        new URL(normalizedUrl);
      } catch {
        toast.error("Please enter a valid URL");
        return;
      }

      setIsLoading(true);
      try {
        const response: Response = await fetch(
          `/api/metadata?url=${encodeURIComponent(normalizedUrl)}`,
        );
        if (response.ok) {
          const data: MetadataResponse = (await response.json()) as MetadataResponse;
          setMetadata({
            title: data.title ?? extractDomain(normalizedUrl),
            description: data.description ?? "",
            image: data.image ?? null,
            favicon: data.favicon ?? null,
            domain: data.domain ?? extractDomain(normalizedUrl),
          });
        } else {
          setMetadata({
            title: extractDomain(normalizedUrl),
            description: "",
            image: null,
            favicon: null,
            domain: extractDomain(normalizedUrl),
          });
        }
      } catch {
        setMetadata({
          title: extractDomain(normalizedUrl),
          description: "",
          image: null,
          favicon: null,
          domain: extractDomain(normalizedUrl),
        });
      } finally {
        setIsLoading(false);
        setMetadataFetched(true);
      }
    },
    [url],
  );

  const handleAddTag = useCallback((): void => {
    const tag: string = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tag: string): void => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent): Promise<void> => {
      e.preventDefault();

      let normalizedUrl: string = url.trim();
      if (
        !normalizedUrl.startsWith("http://") &&
        !normalizedUrl.startsWith("https://")
      ) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      try {
        new URL(normalizedUrl);
      } catch {
        toast.error("Please enter a valid URL");
        return;
      }

      setIsSaving(true);
      try {
        await onCreate({
          user_id: "", // filled by the hook
          url: normalizedUrl,
          title: metadata?.title || extractDomain(normalizedUrl),
          description: metadata?.description || null,
          favicon_url: metadata?.favicon || null,
          domain: metadata?.domain || extractDomain(normalizedUrl),
          tags,
          is_favorite: false,
          is_archived: false,
          view_count: 0,
        });
        toast.success("Bookmark saved");
        handleClose(false);
      } catch {
        toast.error("Failed to save bookmark");
      } finally {
        setIsSaving(false);
      }
    },
    [url, metadata, tags, onCreate, handleClose]
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base">Add Bookmark</DialogTitle>
          <DialogDescription>
            Paste a URL to save it. We&apos;ll fetch the title and preview
            automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div className="space-y-2">
            <label htmlFor="url-input" className="text-sm font-medium">
              URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="url-input"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setMetadataFetched(false);
                    setMetadata(null);
                  }}
                  onBlur={() => {
                    if (!metadataFetched) {
                      void fetchMetadata();
                    }
                  }}
                  onPaste={(event) => {
                    const pasted: string =
                      event.clipboardData.getData("text") ?? "";
                    if (!pasted) return;

                    const trimmed: string = pasted.trim();
                    setUrl(trimmed);
                    setMetadataFetched(false);
                    setMetadata(null);

                    // Use the pasted value directly so we are not racing against state updates.
                    void fetchMetadata(trimmed);
                  }}
                  className="pl-9"
                  autoFocus
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void fetchMetadata()}
                disabled={isLoading || !url.trim()}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Refetch"
                )}
              </Button>
            </div>
          </div>

          {/* Metadata Preview */}
          {metadataFetched && metadata && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-sm font-medium text-foreground line-clamp-1">
                {metadata.title}
              </p>
              {metadata.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {metadata.description}
                </p>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground/60">
                {metadata.domain}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tag-input" className="text-sm font-medium">
              Tags{" "}
              <span className="font-normal text-muted-foreground">
                (optional, max 5)
              </span>
            </label>
            <div className="flex gap-2">
              <Input
                id="tag-input"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                disabled={tags.length >= 5}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="rounded-full p-0.5 hover:bg-foreground/10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!url.trim() || isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Bookmark
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
