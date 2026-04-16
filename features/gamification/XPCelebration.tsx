"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/stores/session-store";

function Particle({ index }: { index: number }) {
  const angle = (index / 16) * Math.PI * 2;
  const [distance] = useState(() => 60 + Math.random() * 50);
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-accent"
      style={{ left: "50%", top: "50%" }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
      }}
      transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.025 }}
    />
  );
}

export function XPCelebration() {
  const celebration = useSessionStore((s) => s.pendingCelebration);
  const setCelebration = useSessionStore((s) => s.setCelebration);
  const [animatedValue, setAnimatedValue] = useState(0);

  const xpAmount = celebration ? parseInt(celebration, 10) : 0;
  const isXP = !isNaN(xpAmount) && xpAmount > 0;

  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => setCelebration(null), 2500);

    if (isXP) {
      const start = performance.now();
      const duration = 600;
      let frame: number;
      function tick(now: number) {
        const progress = Math.min((now - start) / duration, 1);
        setAnimatedValue(Math.round(progress * xpAmount));
        if (progress < 1) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
      return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
    }

    return () => clearTimeout(timer);
  }, [celebration, isXP, xpAmount, setCelebration]);

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            {/* Particles */}
            {Array.from({ length: 16 }, (_, i) => (
              <Particle key={i} index={i} />
            ))}

            <motion.div
              className="rounded-2xl border border-accent/30 bg-bg-elevated/95 px-8 py-6 text-center shadow-glow backdrop-blur-md"
              initial={{ scale: 0.5, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="mb-2 text-5xl"
                animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {isXP ? "\u2728" : "\u{1F3C6}"}
              </motion.div>
              <p className="text-xl font-bold text-text-primary">
                {isXP ? `+${animatedValue} XP` : celebration}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
