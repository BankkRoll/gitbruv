import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { SWRProvider } from "@/lib/query-client";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
});

function MainLayout() {
  return (
    <SWRProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 m-2 border rounded-lg bg-accent-foreground">
          <Outlet />
        </main>
      </div>
    </SWRProvider>
  );
}
