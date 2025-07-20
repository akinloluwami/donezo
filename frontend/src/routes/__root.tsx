import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useUserStore } from "../lib/user-store";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const loadUser = useUserStore((s) => s.fetchUser);

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <React.Fragment>
      <Toaster richColors />
      <Outlet />
    </React.Fragment>
  );
}
