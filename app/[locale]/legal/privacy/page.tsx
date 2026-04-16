import { Link } from "@/lib/i18n/navigation";
import Footer from "@/features/landing/Footer";
import { Header } from "@/components/layout/Header";

export const metadata = {
  title: "Política de privacidad — Safia",
  description: "Cómo Safia gestiona tus datos personales.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-16">
        <div className="mb-10">
          <Link
            href="/legal"
            className="text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            ← Legal
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">Política de privacidad</h1>
        <p className="text-text-muted text-sm mb-12">
          Última actualización: abril 2025
        </p>

        <div className="space-y-10 prose-safia">

          <section>
            <h2>Qué datos recopilamos</h2>
            <p>
              Cuando inicias sesión con un proveedor OAuth (Google, GitHub o Apple), únicamente
              almacenamos el <strong>identificador único del proveedor</strong> (un ID opaco).
              Nunca almacenamos ni procesamos tu dirección de correo electrónico, nombre, foto
              de perfil ni ningún otro dato personal de tu cuenta del proveedor.
            </p>
          </section>

          <section>
            <h2>Qué NO recopilamos</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary">
              <li>Correo electrónico ni nombre</li>
              <li>Contraseñas</li>
              <li>Ubicación ni datos de geolocalización</li>
              <li>Historial de navegación</li>
              <li>Dirección IP de forma persistente</li>
              <li>Datos de pago (la plataforma es gratuita)</li>
            </ul>
          </section>

          <section>
            <h2>Cómo almacenamos tu progreso</h2>
            <p>
              <strong>Usuarios invitados (sin cuenta):</strong> el progreso de lecciones y
              simuladores se guarda exclusivamente en el <code className="text-accent bg-accent-muted px-1 rounded text-sm">localStorage</code> de tu
              navegador. Estos datos no se envían a ningún servidor y desaparecen si limpias
              el almacenamiento local.
            </p>
            <p>
              <strong>Usuarios autenticados:</strong> el progreso se sincroniza en una base de
              datos PostgreSQL alojada en servidores dentro de la UE. Los datos se asocian
              únicamente al ID de proveedor, nunca a datos personales identificables.
            </p>
          </section>

          <section>
            <h2>Terceros, analíticas y publicidad</h2>
            <p>
              Safia <strong>no integra ninguna herramienta de analítica de terceros</strong>,
              ni Google Analytics, ni Mixpanel, ni similares. No mostramos publicidad de ningún
              tipo. No vendemos ni compartimos datos con terceros.
            </p>
          </section>

          <section>
            <h2>Derecho de supresión</h2>
            <p>
              Puedes eliminar completamente tu cuenta y todos los datos asociados en cualquier
              momento enviando una solicitud autenticada al endpoint:
            </p>
            <pre className="bg-bg-elevated border border-accent/20 rounded-lg p-4 text-sm text-accent overflow-x-auto">
              DELETE /api/me
            </pre>
            <p>
              Esta acción es irreversible y borra todo el progreso, configuración y el ID de
              proveedor almacenado.
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              Utilizamos <strong>una única cookie estrictamente necesaria</strong> para gestionar
              la sesión autenticada (token de sesión NextAuth). No establecemos cookies de
              seguimiento, analíticas ni de publicidad. Esta cookie es esencial para el
              funcionamiento de la autenticación y no puede desactivarse si usas una cuenta.
            </p>
          </section>

          <section>
            <h2>Contacto</h2>
            <p>
              Para cualquier consulta relacionada con privacidad, abre un issue en nuestro
              repositorio público:{" "}
              <a
                href="https://github.com/safia-platform/safia/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline underline-offset-4 transition-colors"
              >
                github.com/safia-platform/safia/issues
              </a>
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-accent/10 flex gap-4 text-sm">
          <Link
            href="/legal/terms"
            className="text-text-muted hover:text-text-secondary transition-colors"
          >
            Términos de uso →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
