"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const trustKeys = [
  { icon: "\u{1F513}", key: "noAccount" },
  { icon: "\u{1F4D6}", key: "openSource" },
  { icon: "\u{1F6AB}", key: "noAds" },
  { icon: "\u{1F4AF}", key: "free" },
] as const;

export default function TrustBar() {
  const t = useTranslations("landing.trust");

  return (
    <section className="py-12 border-y border-accent/10 bg-bg-surface/30">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="flex flex-wrap justify-center gap-8 sm:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          {trustKeys.map(({ icon, key }) => (
            <div key={key} className="flex items-center gap-3 text-text-secondary">
              <span className="text-2xl" aria-hidden="true">{icon}</span>
              <span className="text-sm font-medium tracking-wide uppercase">{t(key)}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
