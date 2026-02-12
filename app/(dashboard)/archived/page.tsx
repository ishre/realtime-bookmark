import { BookmarkGrid } from "@/components/bookmark-grid";
import { getBookmarksServer } from "@/lib/actions/bookmarks";

export const dynamic: "force-dynamic" = "force-dynamic";

export default async function ArchivedPage() {
  const initialBookmarks = await getBookmarksServer();
  return <BookmarkGrid view="archived" initialBookmarks={initialBookmarks} />;
}

