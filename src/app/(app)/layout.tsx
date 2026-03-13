import { Sidebar } from "@/components/ui/sidebar";
import { TopBar } from "@/components/ui/top-bar";
import { UserHydrator } from "@/components/user-hydrator";
import { LevelUpCelebration } from "@/components/gamification/level-up-celebration";
import { AchievementPopup } from "@/components/gamification/achievement-popup";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserHydrator>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col md:ml-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-14 md:mt-0">
            {children}
          </main>
        </div>
      </div>
      <LevelUpCelebration />
      <AchievementPopup />
    </UserHydrator>
  );
}
