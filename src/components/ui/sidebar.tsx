"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  FolderKanban,
  Trophy,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/skill/figma", label: "Skill Tracks", icon: Layers },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/inspiration", label: "Inspiration", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border-subtle bg-bg-secondary md:flex md:flex-col">
      <div className="p-6">
        <Link href="/dashboard" className="font-heading text-xl font-bold">
          NaghamOS
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-bg-tertiary text-text-primary"
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
