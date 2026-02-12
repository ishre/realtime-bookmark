/**
 * Light paper-like colors for bookmark cards - professional, no dark tones.
 */
export const BOOKMARK_COLORS: readonly string[] = [
  "#F8F6F1", // warm cream
  "#F5F5F0", // ivory
  "#E8F0F2", // light blue-gray
  "#F0F2E8", // sage
  "#F8F4F0", // linen
  "#F2F4F8", // cool gray
  "#F5F0EA", // warm white
  "#EEF2F0", // mint cream
] as const;

export function getBookmarkColor(bookmarkId: string): string {
  let hash: number = 0;
  for (let i = 0; i < bookmarkId.length; i++) {
    hash = (hash << 5) - hash + bookmarkId.charCodeAt(i);
    hash |= 0;
  }
  const index: number = Math.abs(hash) % BOOKMARK_COLORS.length;
  return BOOKMARK_COLORS[index];
}

export function getBookmarkRotation(bookmarkId: string): number {
  let hash: number = 0;
  for (let i = 0; i < bookmarkId.length; i++) {
    hash = (hash << 5) - hash + bookmarkId.charCodeAt(i);
    hash |= 0;
  }
  return ((Math.abs(hash) % 13) - 6);
}
