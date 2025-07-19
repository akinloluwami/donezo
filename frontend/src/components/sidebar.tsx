import { Link, useLocation } from "@tanstack/react-router";
import { Box, Scan, Settings, Target } from "lucide-react";

const Sidebar = () => {
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
    {
      icon: Settings,
      label: "Settings",
      href: "/app/settings",
    },
  ];

  const pathname = useLocation().pathname;
  const isActive = (href: string) => pathname === href;

  return (
    <div className="w-80  h-full py-2 px-4 flex items-center">
      <div className="bg-white h-[99%] w-full rounded-2xl px-6 py-10 shadow">
        <div className="flex flex-col space-y-3">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`flex items-center space-x-2 text-gray-700 hover:text-gray-900 ${
                isActive(link.href) ? "bg-accent/10" : "hover:bg-gray-100"
              } transition-colors px-2 py-3 rounded-2xl`}
            >
              <link.icon size={16} />
              <span className="text-sm">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
