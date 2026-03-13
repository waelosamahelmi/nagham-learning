"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface XPCounterProps {
  value: number;
  className?: string;
}

export function XPCounter({ value, className }: XPCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString()
  );
  const prevValue = useRef(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: "easeOut",
    });
    prevValue.current = value;
    return controls.stop;
  }, [value, count]);

  return (
    <motion.span className={className}>
      {rounded}
    </motion.span>
  );
}
