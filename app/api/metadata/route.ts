import { type NextRequest, NextResponse } from "next/server";

interface MetadataResponse {
  title: string;
  description: string;
  image: string | null;
  favicon: string | null;
  domain: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<MetadataResponse | { error: string }>> {
  const { searchParams } = new URL(request.url);
  const urlParam: string | null = searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    const parsedUrl: URL = new URL(urlParam);
    const domain: string = parsedUrl.hostname.replace(/^www\./, "");

    const controller: AbortController = new AbortController();
    const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => controller.abort(), 8000);

    let html: string;
    try {
      const response: Response = await fetch(urlParam, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; BookmarkBot/1.0; +https://bookmarks.app)",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: controller.signal,
        redirect: "follow",
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json({
          title: domain,
          description: "",
          image: null,
          favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
          domain,
        });
      }

      html = await response.text();
    } catch {
      clearTimeout(timeoutId);
      return NextResponse.json({
        title: domain,
        description: "",
        image: null,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        domain,
      });
    }

    // Parse metadata from HTML
    const title: string = extractMetaContent(html, [
      'property="og:title"',
      'name="twitter:title"',
      'name="title"',
    ]) || extractTagContent(html, "title") || domain;

    const description: string = extractMetaContent(html, [
      'property="og:description"',
      'name="twitter:description"',
      'name="description"',
    ]) || "";

    const image: string | null = extractMetaContent(html, [
      'property="og:image"',
      'name="twitter:image"',
      'name="twitter:image:src"',
    ]) || null;

    // Resolve relative image URL
    const resolvedImage: string | null = image
      ? resolveUrl(image, urlParam)
      : null;

    const favicon: string | null =
      extractFavicon(html, urlParam) ||
      `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

    return NextResponse.json({
      title: title.trim().substring(0, 200),
      description: description.trim().substring(0, 500),
      image: resolvedImage,
      favicon,
      domain,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}

function extractMetaContent(html: string, attributes: string[]): string | null {
  for (const attr of attributes) {
    const regex = new RegExp(
      `<meta[^>]*${attr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^>]*content=["']([^"']*)["'][^>]*/?>`,
      "i"
    );
    const match: RegExpMatchArray | null = html.match(regex);
    if (match?.[1]) return match[1];

    // Try reverse order (content before attribute)
    const regexReverse = new RegExp(
      `<meta[^>]*content=["']([^"']*)["'][^>]*${attr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^>]*/?>`,
      "i"
    );
    const matchReverse: RegExpMatchArray | null = html.match(regexReverse);
    if (matchReverse?.[1]) return matchReverse[1];
  }
  return null;
}

function extractTagContent(html: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i");
  const match: RegExpMatchArray | null = html.match(regex);
  return match?.[1]?.trim() || null;
}

function extractFavicon(html: string, baseUrl: string): string | null {
  const regex =
    /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["'][^>]*\/?>/i;
  const match: RegExpMatchArray | null = html.match(regex);

  // Try reverse order
  const regexReverse =
    /<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["'][^>]*\/?>/i;
  const matchReverse: RegExpMatchArray | null = html.match(regexReverse);

  const href: string | undefined = match?.[1] || matchReverse?.[1];
  if (href) return resolveUrl(href, baseUrl);

  return null;
}

function resolveUrl(url: string, base: string): string {
  try {
    return new URL(url, base).href;
  } catch {
    return url;
  }
}
