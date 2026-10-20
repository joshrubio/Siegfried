import { Suspense } from "react";
import { signIn } from "./actions";

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const from = typeof params.from === "string" ? params.from : "/";

  return (
    <form action={signIn} className="w-full max-w-sm">
      <input type="hidden" name="from" value={from} />
      <label className="block mb-4">
        <span className="block mb-1.5 text-sm text-muted-foreground">Work email</span>
        <input
          name="email"
          type="email"
          placeholder="you@company.com"
          autoFocus
          className="w-full h-10 bg-input/40 border border-border rounded-lg px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30 transition-colors"
        />
      </label>
      <button
        type="submit"
        className="w-full h-10 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors"
      >
        Continue
      </button>
      <p className="mt-4 text-xs text-muted-foreground/70 leading-relaxed">
        Demo access gate — any input (or none) signs you in. This is a portfolio project; there is
        no real authentication and no email is sent or stored.
      </p>
    </form>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <main className="flex-1 flex items-center justify-center px-6 min-h-[calc(100vh-56px)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-semibold tracking-tight text-2xl">Siegfried</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to the development control plane
          </p>
        </div>
        <Suspense fallback={<div className="h-40" />}>
          <LoginForm searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
