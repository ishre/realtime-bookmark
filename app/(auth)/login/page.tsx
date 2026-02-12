import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export const dynamic: "force-dynamic" = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  async function signInWithGoogle(): Promise<void> {
    "use server";

    const callbackUrl: string =
      process.env.NEXT_PUBLIC_SITE_URL?.concat("/auth/callback") ??
      "http://localhost:3000/auth/callback";

    const supabaseForAction = await createSupabaseServerClient();

    const { data, error } = await supabaseForAction.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Google sign-in error", error);
      return;
    }

    if (data?.url) {
      redirect(data.url);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white px-8 py-8 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
            Smart Bookmark Manager
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-stone-800">
            Sign in to continue
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Access your bookmark workspace with your Google account.
          </p>
        </div>
        <form action={signInWithGoogle}>
          <Button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 border-stone-700 bg-stone-800 text-white hover:bg-stone-700"
          >
            <LogIn className="h-4 w-4" />
            Continue with Google
          </Button>
        </form>
      </div>
    </div>
  );
}

