"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function SimulatorTeaser() {
  const t = useTranslations("landing.simulator");

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">{t("heading")}</h2>
          <p className="mt-4 text-text-secondary text-lg max-w-lg mx-auto">{t("subheading")}</p>
        </motion.div>

        <motion.div
          className="relative max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-warning/90 text-bg-base text-center py-2 px-4 rounded-t-xl font-bold text-sm tracking-wide">
            {t("banner")}
          </div>

          <div className="bg-white rounded-b-xl p-8 text-center">
            <div className="text-2xl font-medium text-gray-800 mb-1">
              <span className="text-[#4285f4]">G</span>
              <span className="text-[#ea4335]">o</span>
              <span className="text-[#fbbc05]">o</span>
              <span className="text-[#4285f4]">g</span>
              <span className="text-[#34a853]">l</span>
              <span className="text-[#ea4335]">e</span>
            </div>
            <p className="text-gray-600 text-sm mt-2 mb-6">{t("signIn")}</p>

            <div className="space-y-3 max-w-xs mx-auto">
              <div className="w-full h-10 rounded border border-gray-300 bg-gray-50" />
              <div className="w-full h-10 rounded border border-gray-300 bg-gray-50" />
              <div className="w-full h-10 rounded-md bg-[#1a73e8] flex items-center justify-center">
                <span className="text-white text-sm font-medium">{t("next")}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <span className="inline-block w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span>{t("redFlags")}</span>
            </div>
          </div>

          <div
            className="absolute -inset-4 -z-10 rounded-2xl opacity-30 blur-xl"
            style={{ background: "var(--gradient-accent)" }}
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  );
}
