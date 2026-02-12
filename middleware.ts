import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const requestUrl: URL = new URL(request.url);
  const pathname: string = requestUrl.pathname;

  const isAuthRoute: boolean =
    pathname === "/login" || pathname.startsWith("/auth/callback") || pathname === "/callback";

  const isProtectedRoute: boolean =
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/archived") ||
    pathname.startsWith("/favorites");

  const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const response: NextResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: { path?: string }) {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: { path?: string }) {
        request.cookies.set({ name: "", value: "", ...options });
        response.cookies.set({ name: "", value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedRoute && !user) {
    const redirectUrl: URL = new URL("/login", requestUrl.origin);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

