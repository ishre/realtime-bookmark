import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn("Supabase environment variables are missing in server.ts");
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: { path?: string }) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: { path?: string }) {
        cookieStore.set({ name, value: "", path: options.path ?? "/", maxAge: 0 });
      },
    },
  });
}

