import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Aura Audio" },
      { name: "description", content: "Sign in to your Aura Audio account." },
      { property: "og:title", content: "Login — Aura Audio" },
      { property: "og:description", content: "Sign in to your Aura Audio account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,oklch(0.3_0.01_240/0.4),transparent_60%)]" />
      </div>

      <div className="w-full max-w-md glass p-10">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 rounded-full border border-silver/40 bg-gradient-to-br from-silver-bright to-silver/30" />
          <h1 className="mt-6 font-serif text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your Aura Audio account</p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <Field label="Email">
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              autoComplete="email" placeholder="you@domain.com"
              className="w-full bg-transparent border-b border-border focus:border-silver outline-none py-3 text-sm placeholder:text-muted-foreground/60"
            />
          </Field>
          <Field label="Password">
            <input
              type="password" value={pw} onChange={(e) => setPw(e.target.value)}
              autoComplete="current-password" placeholder="••••••••"
              className="w-full bg-transparent border-b border-border focus:border-silver outline-none py-3 text-sm placeholder:text-muted-foreground/60"
            />
          </Field>

          <div className="flex justify-end">
            <a href="#" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-silver-bright text-primary-foreground py-4 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition"
          >
            Sign in
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          New to Aura? <Link to="/login" className="text-foreground border-b border-silver/40 hover:border-silver">Request access</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-silver mb-1">{label}</span>
      {children}
    </label>
  );
}
