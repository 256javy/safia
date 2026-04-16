"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SimulatorTooltipProps {
  tip: string;
  visible: boolean;
}

export function SimulatorTooltip({ tip, visible }: SimulatorTooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="mt-3 rounded-lg border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-text-secondary leading-relaxed"
          initial={{ opacity: 0, y: -5, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -5, height: 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="mr-1.5 text-accent font-semibold">Tip:</span>
          {tip}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
