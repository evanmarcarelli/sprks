// Real Supabase auth for the website. Provides the signed-in session plus the
// user's profile, admin role (from user_roles), and seller-verification status
// (from seller_verifications) to the whole app via useAuth(). This is the
// shared identity layer — the same Supabase project backs the app, so a login
// here is the same account there.
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// UI-facing seller status, derived from the richer DB enum
// (not_started / pending_ai_review / pending_manual_review / approved /
//  rejected / requires_resubmission).
export type SellerStatus = "none" | "pending" | "verified" | "rejected";

export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at?: string;
};

function mapSellerStatus(raw: string | null | undefined): SellerStatus {
  switch (raw) {
    case "approved":
      return "verified";
    case "pending_ai_review":
    case "pending_manual_review":
      return "pending";
    case "rejected":
    case "requires_resubmission":
      return "rejected";
    default:
      return "none"; // not_started / null
  }
}

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  sellerStatus: SellerStatus;
  isVerifiedSeller: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ error: string | null; needsConfirm: boolean }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sellerStatus, setSellerStatus] = useState<SellerStatus>("none");
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string | undefined) => {
    if (!uid) {
      setProfile(null);
      setIsAdmin(false);
      setSellerStatus("none");
      return;
    }
    const [prof, roles, sv] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
      supabase.from("seller_verifications").select("status").eq("user_id", uid).maybeSingle(),
    ]);
    setProfile((prof.data as Profile) ?? null);
    setIsAdmin(((roles.data as { role: string }[]) ?? []).some((r) => r.role === "admin"));
    setSellerStatus(mapSellerStatus((sv.data as { status?: string } | null)?.status));
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      loadProfile(data.session?.user?.id).finally(() => {
        if (active) setLoading(false);
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      loadProfile(s?.user?.id);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) return { error: error.message, needsConfirm: false };
      return { error: null, needsConfirm: !data.session };
    },
    [],
  );

  const signInWithMagicLink = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsAdmin(false);
    setSellerStatus("none");
  }, []);

  const refreshProfile = useCallback(
    () => loadProfile(session?.user?.id),
    [loadProfile, session],
  );

  const value: AuthState = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    isAdmin,
    sellerStatus,
    isVerifiedSeller: sellerStatus === "verified",
    signIn,
    signUp,
    signInWithMagicLink,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
