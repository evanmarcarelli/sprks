import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Apple } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Login — Spkrs" },
      { name: "description", content: "Sign in to your Spkrs account." },
      { property: "og:title", content: "Login — Spkrs" },
      { property: "og:description", content: "Sign in to your Spkrs account." },
    ],
  }),
  component: LoginPage,
});

type Mode = "signin" | "signup";

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const { signIn, signUp, signInWithMagicLink, signInWithOAuth } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmSent, setConfirmSent] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const oauth = async (provider: "google" | "apple") => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const { error } = await signInWithOAuth(provider);
      // On success the browser redirects to the provider; an error means it
      // isn't enabled in Supabase yet.
      if (error) setError(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMagicLink = async () => {
    if (loading) return;
    setError("");
    if (!email.trim()) {
      setError("Enter your email to get a sign-in link.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await signInWithMagicLink(email.trim());
      if (error) setError(error);
      else setMagicSent(true);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!email.trim() || !pw) {
      setError("Email and password are required.");
      return;
    }
    if (mode === "signup" && pw.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await signIn(email.trim(), pw);
        if (error) {
          setError(error);
          return;
        }
        navigate({ to: redirect ?? "/" });
      } else {
        const { error, needsConfirm } = await signUp(email.trim(), pw, name.trim());
        if (error) {
          setError(error);
          return;
        }
        if (needsConfirm) {
          setConfirmSent(true);
        } else {
          navigate({ to: redirect ?? "/" });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (magicSent) {
    return (
      <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md glass p-10 text-center">
          <h1 className="font-serif text-3xl">Check your inbox</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We sent a one-time sign-in link to <span className="text-foreground">{email}</span>.
            Click it to sign in — no password needed.
          </p>
          <button
            onClick={() => setMagicSent(false)}
            className="mt-8 w-full bg-silver-bright text-primary-foreground py-4 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (confirmSent) {
    return (
      <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md glass p-10 text-center">
          <h1 className="font-serif text-3xl">Check your inbox</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We sent a confirmation link to <span className="text-foreground">{email}</span>.
            Click it to activate your account, then sign in.
          </p>
          <button
            onClick={() => {
              setConfirmSent(false);
              setMode("signin");
              setPw("");
            }}
            className="mt-8 w-full bg-silver-bright text-primary-foreground py-4 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,oklch(0.3_0.01_240/0.4),transparent_60%)]" />
      </div>

      <div className="w-full max-w-md glass p-10">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 rounded-full border border-silver/40 bg-gradient-to-br from-silver-bright to-silver/30" />
          <h1 className="mt-6 font-serif text-3xl">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to your Spkrs account"
              : "Join Spkrs to buy and sell high-end audio"}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => oauth("apple")}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 border border-border py-3.5 text-xs uppercase tracking-[0.2em] hover:border-silver hover:bg-secondary/40 transition disabled:opacity-60"
          >
            <Apple className="h-4 w-4" /> Continue with Apple
          </button>
          <button
            type="button"
            onClick={() => oauth("google")}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 border border-border py-3.5 text-xs uppercase tracking-[0.2em] hover:border-silver hover:bg-secondary/40 transition disabled:opacity-60"
          >
            <span className="font-serif text-base leading-none">G</span> Continue with Google
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form className="mt-6 space-y-6" onSubmit={submit}>
          {mode === "signup" && (
            <Field label="Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Alex M."
                className={inputCls}
              />
            </Field>
          )}
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@domain.com"
              className={inputCls}
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="••••••••"
              className={inputCls}
            />
          </Field>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-silver-bright text-primary-foreground py-4 text-xs uppercase tracking-[0.3em] hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? mode === "signin"
                ? "Signing in…"
                : "Creating…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </button>

          {mode === "signin" && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={sendMagicLink}
                disabled={loading}
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition disabled:opacity-60"
              >
                Email me a sign-in link instead
              </button>
            </div>
          )}
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New to Spkrs? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
            }}
            className="text-foreground border-b border-silver/40 hover:border-silver"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-border focus:border-silver outline-none py-3 text-sm placeholder:text-muted-foreground/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-silver mb-1">{label}</span>
      {children}
    </label>
  );
}
