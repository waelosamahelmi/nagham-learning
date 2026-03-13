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
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { AnimatePresence, motion } from "framer-motion";

const learnerNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/skill/figma", label: "Skill Tracks", icon: Layers },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/inspiration", label: "Inspiration", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
];

const mentorNav = [
  { href: "/mentor", label: "Mentor Hub", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const role = useUserStore((s) => s.role);
  const navItems = role === "mentor" ? [...learnerNav, ...mentorNav] : learnerNav;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border-subtle bg-bg-secondary md:flex md:flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="font-heading text-xl font-bold">
            NaghamOS
          </Link>
          <p className="text-xs text-text-tertiary mt-0.5">Creative Growth Engine</p>
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
                    ? "bg-bg-tertiary text-text-primary font-medium"
                    : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border-subtle p-3">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <MobileNav navItems={navItems} pathname={pathname} />
    </>
  );
}

function MobileNav({
  navItems,
  pathname,
}: {
  navItems: typeof learnerNav;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-border-subtle bg-bg-secondary px-4">
        <Link href="/dashboard" className="font-heading text-lg font-bold">
          NaghamOS
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-14 left-0 bottom-0 z-40 w-64 border-r border-border-subtle bg-bg-secondary p-3 space-y-1 overflow-y-auto"
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-bg-tertiary text-text-primary font-medium"
                      : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-border-subtle pt-2 mt-2">
              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/login";
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
