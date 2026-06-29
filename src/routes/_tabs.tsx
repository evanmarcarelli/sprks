import { Outlet, createFileRoute } from "@tanstack/react-router";
import { TabBar } from "@/components/tab-bar";

// Pathless layout for the in-site "app" experience (Discover / Marketplace /
// Saved). Renders the app's centered mobile column + bottom tab bar. The
// marketing chrome (SiteHeader/SiteFooter) is intentionally NOT applied here —
// __root skips it for product routes so there's no double-wrap.
export const Route = createFileRoute("/_tabs")({
  component: TabsLayout,
});

function TabsLayout() {
  return (
    <div className="min-h-svh bg-background">
      <div className="relative mx-auto min-h-svh w-full max-w-[440px] bg-background">
        <Outlet />
        <TabBar />
      </div>
    </div>
  );
}
