import type { Bookmark, SortOption } from "./types";

export function extractDomain(url: string): string {
  try {
    const hostname: string = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatDate(dateString: string): string {
  const date: Date = new Date(dateString);
  const now: Date = new Date();
  const diffMs: number = now.getTime() - date.getTime();
  const diffMins: number = Math.floor(diffMs / 60000);
  const diffHours: number = Math.floor(diffMs / 3600000);
  const diffDays: number = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function sortBookmarks(bookmarks: Bookmark[], sortBy: SortOption): Bookmark[] {
  const sorted: Bookmark[] = [...bookmarks];

  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "domain":
      return sorted.sort((a, b) => a.domain.localeCompare(b.domain));
    default:
      return sorted;
  }
}

export function filterBookmarks(
  bookmarks: Bookmark[],
  search: string,
  tags: string[]
): Bookmark[] {
  let filtered: Bookmark[] = bookmarks;

  if (search.trim()) {
    const query: string = search.toLowerCase().trim();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query) ||
        b.domain.toLowerCase().includes(query) ||
        b.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  if (tags.length > 0) {
    filtered = filtered.filter((b) => tags.some((tag) => b.tags.includes(tag)));
  }

  return filtered;
}

export function getAllTags(bookmarks: Bookmark[]): string[] {
  const tagSet: Set<string> = new Set<string>();
  bookmarks.forEach((b) => b.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + "...";
}

export function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}
