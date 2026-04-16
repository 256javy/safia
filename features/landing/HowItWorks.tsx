"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const steps = [
  { key: "step1", icon: "\u{1F4DA}" },
  { key: "step2", icon: "\u{1F3AF}" },
  { key: "step3", icon: "\u{1F9EA}" },
] as const;

export default function HowItWorks() {
  const t = useTranslations("landing.howItWorks");

  return (
    <section className="py-24 px-6 bg-bg-surface/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">{t("heading")}</h2>
          <p className="mt-4 text-text-secondary text-lg">{t("subheading")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-muted text-3xl mb-6">
                {step.icon}
              </div>
              <div className="text-accent text-sm font-bold uppercase tracking-widest mb-2">
                {t("step", { n: i + 1 })}
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">{t(`${step.key}.title`)}</h3>
              <p className="text-text-secondary leading-relaxed">{t(`${step.key}.description`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
