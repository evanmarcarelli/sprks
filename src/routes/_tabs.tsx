import { Outlet, createFileRoute } from "@tanstack/react-router";

// Pathless layout for the in-site product experience (Discover / Marketplace /
// Saved). It no longer imposes a mobile column or bottom tab bar — the shared
// SiteHeader (from __root) provides navigation, and each page lays itself out
// for desktop. This wrapper just fills the space below the sticky header.
export const Route = createFileRoute("/_tabs")({
  component: TabsLayout,
});

function TabsLayout() {
  return (
    <div className="min-h-[calc(100vh-5rem)]">
      <Outlet />
    </div>
  );
}
