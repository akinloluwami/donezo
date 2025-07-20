import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { Box, Scan, Target, LogOut, X } from "lucide-react";
import { useUserStore } from "../lib/user-store";

const Sidebar = ({
  open,
  setOpen,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const links = [
    {
      icon: Target,
      label: "Home",
      href: "/app/home",
    },
    {
      icon: Scan,
      label: "Tasks",
      href: "/app/tasks",
    },
    {
      icon: Box,
      label: "Collections",
      href: "/app/collections",
    },
  ];

  const pathname = useLocation().pathname;
  const isActive = (href: string) => pathname === href;

  const router = useRouter();
  const clearUser = useUserStore((s) => s.clearUser);

  const handleLogout = async () => {
    clearUser();
    await router.navigate({ to: "/" });
  };

  return (
    <div
      className={`w-80 h-full py-2 px-4 lg:flex items-center lg:static z-50 fixed transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0
`}
    >
      <button
        className="absolute top-4 right-6 z-50 lg:hidden p-2 rounded-full bg-white/40 shadow transition-colors cursor-pointer hover:bg-white/60"
        onClick={() => setOpen?.(false)}
      >
        <X size={14} />
      </button>

      <div className="bg-white h-[99%] w-full rounded-2xl px-6 py-10 shadow flex flex-col justify-between">
        <div className="flex flex-col space-y-3">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`flex items-center space-x-2 text-gray-700 hover:text-gray-900 ${
                isActive(link.href) ? "bg-accent/10" : "hover:bg-gray-100"
              } transition-colors px-2 py-3 rounded-2xl`}
              onClick={() => setOpen?.(false)}
            >
              <link.icon size={16} />
              <span className="text-sm">{link.label}</span>
            </Link>
          ))}
        </div>
        <button
          type="button"
          className="px-4 py-2 text-sm bg-red-500/10 text-red-400 w-full rounded-2xl hover:bg-red-500/15 disabled:opacity-60 mt-8 flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
