export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  domain: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkMetadata {
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  domain: string;
}

export type ViewMode = "grid" | "list";

export type SortOption = "newest" | "oldest" | "alphabetical" | "domain";

export interface BookmarkFilters {
  search: string;
  tags: string[];
  sortBy: SortOption;
}

export type BookmarkAction =
  | { type: "ADD_BOOKMARK"; payload: Bookmark }
  | { type: "REMOVE_BOOKMARK"; payload: string }
  | { type: "UPDATE_BOOKMARK"; payload: { id: string; updates: Partial<Bookmark> } }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "TOGGLE_ARCHIVE"; payload: string }
  | { type: "SET_BOOKMARKS"; payload: Bookmark[] };
