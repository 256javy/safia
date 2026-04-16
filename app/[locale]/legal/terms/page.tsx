import { Link } from "@/lib/i18n/navigation";
import Footer from "@/features/landing/Footer";
import { Header } from "@/components/layout/Header";

export const metadata = {
  title: "Términos de uso — Safia",
  description: "Condiciones de uso de la plataforma Safia.",
};

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold mb-2">Términos de uso</h1>
        <p className="text-text-muted text-sm mb-12">
          Última actualización: abril 2025
        </p>

        <div className="space-y-10 prose-safia">

          <section>
            <h2>Plataforma gratuita, sin garantías</h2>
            <p>
              Safia es una plataforma educativa gratuita. Se ofrece <strong>tal cual</strong>,
              sin garantías de ningún tipo, ya sean expresas o implícitas. No garantizamos la
              disponibilidad ininterrumpida del servicio ni la ausencia de errores en los
              contenidos.
            </p>
          </section>

          <section>
            <h2>Propósito exclusivamente educativo</h2>
            <p>
              Todo el contenido de Safia —lecciones, módulos, simuladores y ejercicios— tiene
              un <strong>propósito estrictamente educativo</strong>. No es una herramienta de
              seguridad operacional y no debe utilizarse para atacar sistemas, redes o
              infraestructuras reales.
            </p>
            <p>
              El conocimiento adquirido en esta plataforma es tu responsabilidad. Safia no se
              hace responsable del uso indebido de los conocimientos obtenidos.
            </p>
          </section>

          <section>
            <h2>Simuladores — solo para formación</h2>
            <p>
              Los simuladores de Safia recrean entornos controlados con fines didácticos.
              Están diseñados para <strong>practicar en un entorno seguro y aislado</strong>.
              Queda expresamente prohibido:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary">
              <li>Usar técnicas aprendidas aquí para atacar sistemas sin autorización explícita</li>
              <li>Intentar escapar del entorno de simulación para afectar sistemas reales</li>
              <li>Compartir credenciales o accesos de simulador con terceros</li>
            </ul>
          </section>

          <section>
            <h2>Licencia</h2>
            <p>
              El código fuente de Safia se distribuye bajo la licencia{" "}
              <a
                href="https://www.gnu.org/licenses/agpl-3.0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline underline-offset-4 transition-colors"
              >
                AGPL-3.0
              </a>
              . El contenido educativo (lecciones, textos) es propiedad de sus autores
              respectivos salvo indicación contraria.
            </p>
          </section>

          <section>
            <h2>Suspensión de cuentas</h2>
            <p>
              Nos reservamos el derecho de suspender o eliminar cuentas sin previo aviso en
              caso de uso abusivo, incluyendo pero no limitado a: intentos de explotación de
              la infraestructura de Safia, acoso a otros usuarios o incumplimiento de estos
              términos.
            </p>
          </section>

          <section>
            <h2>Ley aplicable y RGPD</h2>
            <p>
              Estos términos se rigen por la legislación española. En materia de protección de
              datos, Safia cumple con el{" "}
              <strong>Reglamento General de Protección de Datos (RGPD/GDPR)</strong> de la
              Unión Europea. Para más información sobre el tratamiento de datos personales,
              consulta nuestra{" "}
              <Link
                href="/legal/privacy"
                className="text-accent hover:text-accent-hover underline underline-offset-4 transition-colors"
              >
                política de privacidad
              </Link>
              .
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-accent/10 flex gap-4 text-sm">
          <Link
            href="/legal/privacy"
            className="text-text-muted hover:text-text-secondary transition-colors"
          >
            ← Política de privacidad
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
