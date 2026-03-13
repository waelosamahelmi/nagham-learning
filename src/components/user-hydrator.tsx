"use client";

import { useEffect, type ReactNode } from "react";
import { useUserStore } from "@/stores/user-store";
import { createClient } from "@/lib/supabase/client";

export function UserHydrator({ children }: { children: ReactNode }) {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    async function hydrate() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const [{ data: profile }, { data: level }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("user_levels").select("*").eq("user_id", user.id).maybeSingle(),
      ]);

      if (profile) {
        setUser({
          userId: user.id,
          name: profile.name,
          role: profile.role,
          language: profile.language || "en",
          totalXP: level?.total_xp || 0,
          currentStreak: level?.current_streak || 0,
          longestStreak: level?.longest_streak || 0,
        });
      }
    }

    hydrate();
  }, [setUser]);

  return <>{children}</>;
}
