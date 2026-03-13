"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "xp" | "achievement";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

let toastListeners: Array<(toast: Toast) => void> = [];

export function showToast(toast: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  toastListeners.forEach((listener) => listener({ ...toast, id }));
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  xp: Flame,
  achievement: Flame,
};

const colors = {
  success: "border-level-up/30 text-level-up",
  error: "border-red-500/30 text-red-400",
  info: "border-figma/30 text-figma",
  xp: "border-xp-gold/30 text-xp-gold",
  achievement: "border-achievement-glow/30 text-achievement-glow",
};

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration || 4000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                "flex items-start gap-3 rounded-xl border bg-bg-secondary p-4 shadow-xl",
                colors[toast.type]
              )}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-text-primary">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="shrink-0 text-text-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
