import { createFileRoute } from "@tanstack/react-router";
import { MenuPage } from "@/components/menu-page";
import { getMenu } from "@/lib/menu";

export const Route = createFileRoute("/")({
  loader: () => getMenu(),
  component: Home,
  pendingComponent: MenuPending,
});

function Home() {
  const payload = Route.useLoaderData();
  return <MenuPage payload={payload} />;
}

function MenuPending() {
  return (
    <div className="plaster-page flex min-h-dvh flex-col items-center justify-center px-6">
      <p className="font-display text-3xl tracking-[0.4em] text-ink">PARADA</p>
      <div className="led-line mt-4" />
      <p className="mt-4 text-sm text-mist">در حال چیدن میز...</p>
    </div>
  );
}
