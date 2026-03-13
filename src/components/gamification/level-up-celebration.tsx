"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/stores/user-store";
import { LEVELS } from "@/lib/xp";

const motivationalQuotes = [
  "You're unstoppable! 🚀",
  "Look how far you've come! ✨",
  "Your creativity knows no bounds! 🎨",
  "Every level is a new beginning! 🌟",
  "The world needs your designs! 💫",
];

export function LevelUpCelebration() {
  const [show, setShow] = useState(false);
  const [levelData, setLevelData] = useState<{
    level: number;
    name: string;
  } | null>(null);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      size: number;
      delay: number;
    }>
  >([]);

  const currentLevel = useUserStore((s) => s.currentLevel);

  const previousLevelRef = useCallback(() => {
    const stored = sessionStorage.getItem("nagham_level");
    return stored ? parseInt(stored) : currentLevel.level;
  }, [currentLevel.level]);

  useEffect(() => {
    const prev = previousLevelRef();
    if (currentLevel.level > prev) {
      setLevelData({
        level: currentLevel.level,
        name: currentLevel.name,
      });

      // Generate particles
      const colors = ["#FFD700", "#FF6B35", "#00FF88", "#A259FF", "#83EDFF"];
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
      setShow(true);

      // Auto-dismiss
      setTimeout(() => setShow(false), 4000);
    }
    sessionStorage.setItem("nagham_level", String(currentLevel.level));
  }, [currentLevel, previousLevelRef]);

  const quote =
    motivationalQuotes[
      Math.floor(Math.random() * motivationalQuotes.length)
    ];

  return (
    <AnimatePresence>
      {show && levelData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShow(false)}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md cursor-pointer"
        >
          {/* Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                opacity: 0,
                x: "50vw",
                y: "50vh",
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: `${p.x}vw`,
                y: `${p.y}vh`,
                scale: [0, 1.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: p.delay,
                ease: "easeOut",
              }}
              className="absolute rounded-full"
              style={{
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
              }}
            />
          ))}

          {/* Level Up Content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="text-center z-10"
          >
            <motion.div
              animate={{
                textShadow: [
                  "0 0 20px rgba(255,215,0,0.3)",
                  "0 0 60px rgba(255,215,0,0.6)",
                  "0 0 20px rgba(255,215,0,0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm font-semibold uppercase tracking-widest text-xp-gold"
            >
              Level Up!
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.4,
              }}
              className="font-heading text-[72px] font-bold leading-none mt-4"
              style={{
                background:
                  "linear-gradient(135deg, #FFD700, #FF6B35, #FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {levelData.level}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-2 font-heading text-2xl font-bold text-text-primary"
            >
              {levelData.name}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 text-text-secondary italic"
            >
              {quote}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.5 }}
              className="mt-8 text-xs text-text-tertiary"
            >
              Tap to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
