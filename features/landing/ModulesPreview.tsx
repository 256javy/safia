"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const moduleKeys = ["passwords", "phishing", "mfa", "simulators"] as const;
const moduleIcons = { passwords: "\u{1F511}", phishing: "\u{1F3A3}", mfa: "\u{1F6E1}\uFE0F", simulators: "\u{1F9EA}" };

const difficultyColors: Record<string, string> = {
  "Básico": "bg-success/15 text-success",
  "Basic": "bg-success/15 text-success",
  "Intermedio": "bg-warning/15 text-warning",
  "Intermediate": "bg-warning/15 text-warning",
  "Intermediário": "bg-warning/15 text-warning",
  "Avanzado": "bg-destructive/15 text-destructive",
  "Advanced": "bg-destructive/15 text-destructive",
  "Avançado": "bg-destructive/15 text-destructive",
};

export default function ModulesPreview() {
  const t = useTranslations("landing.modules");

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">{t("heading")}</h2>
          <p className="mt-4 text-text-secondary text-lg max-w-lg mx-auto">{t("subheading")}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {moduleKeys.map((key, i) => {
            const difficulty = t(`${key}.difficulty`);
            return (
              <motion.article
                key={key}
                className="group relative bg-bg-surface rounded-xl p-6 border border-accent/10 transition-all duration-300 hover:border-accent/30 hover:shadow-glow cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-4xl block mb-4" aria-hidden="true">{moduleIcons[key]}</span>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{t(`${key}.title`)}</h3>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">{t(`${key}.description`)}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-text-muted">{t(`${key}.time`)}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${difficultyColors[difficulty] ?? ""}`}>
                    {difficulty}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
