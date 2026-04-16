import { Link } from "@/lib/i18n/navigation";

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 text-5xl">🔒</div>
        <h1 className="text-2xl font-bold text-text-primary mb-3">
          Inicio de sesión — Próximamente
        </h1>
        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
          Estamos preparando el acceso con Google, GitHub y Apple.
          Por ahora puedes usar Safia sin cuenta — tu progreso se guarda
          en este dispositivo.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: "var(--gradient-accent)" }}
        >
          Explorar cursos sin cuenta →
        </Link>
      </div>
    </main>
  );
}
