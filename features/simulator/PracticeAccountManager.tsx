"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePracticeAccountsStore } from "@/stores/practice-accounts-store";

const PLATFORM_OPTIONS = [
  { value: "google", label: "Google", icon: "\u{1F310}" },
  { value: "facebook", label: "Facebook", icon: "\u{1F4F1}" },
  { value: "x", label: "X (Twitter)", icon: "\u{1F426}" },
  { value: "tiktok", label: "TikTok", icon: "\u{1F3B5}" },
  { value: "banking", label: "Banco (SecureBank)", icon: "\u{1F3E6}" },
];

function getPlatformInfo(platform: string) {
  return PLATFORM_OPTIONS.find((p) => p.value === platform) ?? { value: platform, label: platform, icon: "?" };
}

export function PracticeAccountManager() {
  const { accounts, addAccount, removeAccount } = usePracticeAccountsStore();

  const [platform, setPlatform] = useState("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setFormError("El email es obligatorio.");
      return;
    }
    if (!password) {
      setFormError("La contraseña es obligatoria.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Las contraseñas no coinciden.");
      return;
    }

    addAccount(platform, email, password);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSuccessMsg("Cuenta de práctica creada correctamente.");
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  // Group accounts by platform
  const grouped = PLATFORM_OPTIONS.map((p) => ({
    ...p,
    accounts: accounts.filter((a) => a.platform === p.value),
  })).filter((g) => g.accounts.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <span>&#128272;</span> Cuentas de práctica
        </h2>
        <p className="text-sm text-text-muted mt-1">Tu bóveda de entrenamiento local</p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-400 space-y-3">
        <p className="font-semibold flex items-center gap-2">
          <span>&#9888;&#65039;</span> Solo en este dispositivo
        </p>
        <p className="text-amber-300/80">
          Estas credenciales se guardan únicamente en el localStorage de tu navegador.
          No se envían a ningún servidor. Si limpias el caché del navegador, se eliminarán.
        </p>
        <p className="text-amber-300/80">
          <span className="text-amber-400">&#128161;</span> Recomendamos usar un gestor de contraseñas real para crear
          una bóveda dedicada a ejercicios de seguridad. Proton Pass* es una opción gratuita
          y de código abierto que funciona muy bien para esto.
        </p>
        <p className="text-amber-300/60 text-xs">
          * Safia no tiene ningún acuerdo comercial ni de afiliación con Proton AG.
          &ldquo;Proton Pass&rdquo; es una marca registrada de Proton AG. La mención es solo educativa.
        </p>
      </div>

      {/* Add account form */}
      <div className="rounded-xl border border-accent/10 bg-bg-surface p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Crear cuenta de práctica</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Platform select */}
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Plataforma</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-lg border border-accent/20 bg-bg-elevated px-3 py-2.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none transition-colors"
            >
              {PLATFORM_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.icon} {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Email de práctica</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@entrenamiento.local"
              autoComplete="off"
              className="w-full rounded-lg border border-accent/20 bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Contraseña de práctica</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña ficticia"
                autoComplete="new-password"
                className="w-full rounded-lg border border-accent/20 bg-bg-elevated px-3 py-2.5 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/50 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Confirmar contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              autoComplete="new-password"
              className="w-full rounded-lg border border-accent/20 bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Errors / success */}
          <AnimatePresence mode="wait">
            {formError && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-red-400"
              >
                {formError}
              </motion.p>
            )}
            {successMsg && (
              <motion.p
                key="success"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-success"
              >
                {successMsg}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.01] hover:opacity-90"
            style={{ background: "var(--gradient-accent)" }}
          >
            Crear cuenta de práctica
          </button>
        </form>
      </div>

      {/* Accounts list */}
      <div className="rounded-xl border border-accent/10 bg-bg-surface p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Cuentas guardadas</h3>

        {grouped.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-6">
            Aún no tienes cuentas de práctica. Crea una para entrenar con los simuladores.
          </p>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => (
              <div key={group.value}>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span>{group.icon}</span> {group.label}
                </p>
                <div className="space-y-2">
                  {group.accounts.map((account) => (
                    <motion.div
                      key={account.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="flex items-center justify-between rounded-lg border border-accent/10 bg-bg-elevated px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-text-primary truncate">{account.email}</p>
                        <p className="text-xs text-text-muted mt-0.5">&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;</p>
                      </div>
                      <button
                        onClick={() => removeAccount(account.id)}
                        className="ml-4 shrink-0 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10"
                      >
                        Eliminar
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
