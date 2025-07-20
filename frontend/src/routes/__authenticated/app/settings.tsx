import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__authenticated/app/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/__authenticated/app/settings"!</div>;
}
