"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function NewsletterSection() {
  const t = useTranslations("landing.newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-24 px-6">
      <motion.div
        className="max-w-lg mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">{t("heading")}</h2>
        <p className="mt-4 text-text-secondary text-lg mb-8">{t("subheading")}</p>

        {status === "success" ? (
          <div className="bg-success/10 border border-success/30 rounded-xl p-4 text-success font-medium">
            {t("success")}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              required
              className="flex-1 px-4 py-3 rounded-xl bg-bg-surface border border-accent/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
              style={{ background: "var(--gradient-accent)" }}
            >
              {status === "loading" ? t("sending") : t("submit")}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-destructive text-sm">{t("error")}</p>
        )}
      </motion.div>
    </section>
  );
}
