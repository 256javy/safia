"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/i18n/navigation";
import { PLATFORM_IDS, PLATFORMS } from "@/features/simulator/platforms/registry";
import { PlatformLogo } from "./PlatformLogo";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PlatformPicker({ open, onClose }: Props) {
  const t = useTranslations("accounts.picker");
  const tp = useTranslations("simulator.platforms");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-accent/15 bg-bg-elevated p-6"
          >
            <h2 className="text-lg font-bold text-text-primary">{t("title")}</h2>
            <p className="mt-1 text-sm text-text-secondary">{t("subtitle")}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {PLATFORM_IDS.map((id) => (
                <Link
                  key={id}
                  href={`/simulator/${id}/create`}
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 rounded-xl border border-accent/10 bg-bg-surface p-4 text-center transition-colors hover:border-accent/40"
                >
                  <PlatformLogo platform={id} size={40} />
                  <span className="text-sm font-semibold text-text-primary">{tp(PLATFORMS[id].nameKey)}</span>
                </Link>
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full rounded-lg border border-accent/15 py-2 text-sm text-text-secondary hover:border-accent/30"
            >
              {t("cancel")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
