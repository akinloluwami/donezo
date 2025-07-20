import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useUserStore } from "../lib/user-store";

export const Route = createFileRoute("/__auth")({
  beforeLoad: async ({ location }) => {
    const user = useUserStore.getState().user;
    if (user) {
      throw redirect({
        to: "/app/home",
        search: { redirect: location.href },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
