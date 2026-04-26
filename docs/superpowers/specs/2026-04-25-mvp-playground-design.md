# Safia MVP — Playground & Centro de cuentas

**Status:** approved 2026-04-25 · **Owner:** @256javy

Reorientación del producto a un MVP listo para producción centrado en el playground de prácticas. Las lecciones, rutas y perfil quedan fuera del MVP; la propuesta de valor pasa a ser un **centro de cuentas** sobre el que se montan simuladores realistas de cuatro plataformas con todos sus flujos.

> Anclado en `VISION.md` §5 (atlas) y §4 (estados *obligación* y *curiosidad*). Quien aterriza en el playground debe poder recorrer todo en ~30 minutos sin leer una sola lección.

---

## 1. Scope MVP

### Dentro
- **Centro de cuentas** (hub localStorage): la pantalla principal del producto.
- **Simuladores** de 4 plataformas: **Google, Instagram, Facebook, Banco** (SecureBank genérico).
- **5 flujos por plataforma**:
  1. Crear cuenta
  2. Iniciar sesión (con variantes: pass correcta, pass incorrecta, cuenta inexistente, MFA, *actividad sospechosa*)
  3. Cambiar contraseña — vía autenticada (pass actual + nueva)
  4. Cambiar contraseña — vía "olvidé mi contraseña" (recovery code)
  5. Gestionar 2FA (activar/desactivar; banco no permite desactivar)
- **Recuperar acceso** (camino que desemboca en flujo 4).
- **TOTP real** (RFC 6238) con QR escaneable por Google Authenticator / Authy / 1Password.
- **i18n es / en / pt** desde día uno. Mensajes de validación traducidos (sin tooltips nativos del navegador).
- **Landing recortada**: hero + teaser de simulador + newsletter + footer + legal.
- **Botón salir global** visible en todo simulador.

### Fuera (se mantienen en disco para v1.1)
- Cursos / lecciones MDX / `content/modules/*`.
- Roadmap, perfil de usuario, certificados (`/courses`, `/roadmap`, `/profile`, `/cert`).
- Auth.js / OAuth — el MVP es **sin login**, todo en localStorage.
- Phishing simulado (se retoma en v1.1 montado encima del centro de cuentas).
- Analytics / supabase para datos de usuario. Supabase queda únicamente para newsletter.

### Principios de seguridad heredados (no negociables, ver `CLAUDE.md`)
- `e.preventDefault()` y `e.stopPropagation()` en cada submit del simulador.
- Cero red: no `fetch`, `axios`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, ni `action=` que apunte fuera.
- `TrainingBanner` siempre visible en simuladores.
- `robots: { index: false, follow: false }` en cada página de simulador.
- CSP `frame-ancestors 'none'`.
- Contraseñas **nunca** se guardan en plaintext (ver §3.4).
- TOTP es offline por diseño (no contradice "cero red").

---

## 2. Rutas

Slugs estables en inglés; UI traducida via `next-intl`.

| Ruta | Propósito |
|---|---|
| `/` → redirect locale | — |
| `/[locale]` | Landing recortada |
| `/[locale]/accounts` | **Centro de cuentas** (hub) |
| `/[locale]/simulator` | Índice de plataformas |
| `/[locale]/simulator/[platform]` | Hub de la plataforma: lista cuentas existentes + acciones |
| `/[locale]/simulator/[platform]/create` | Crear cuenta |
| `/[locale]/simulator/[platform]/login?account=<id>` | Iniciar sesión |
| `/[locale]/simulator/[platform]/change-password?account=<id>&via=auth\|forgot` | Cambiar contraseña |
| `/[locale]/simulator/[platform]/recover?account=<id>` | Recuperar acceso (entrega code → redirige a change-password con `via=forgot`) |
| `/[locale]/simulator/[platform]/totp?account=<id>&action=enable\|disable` | Gestionar 2FA |

`[platform]` ∈ `{google, instagram, facebook, bank}`. Pasar un `account` que no existe → redirect al hub de la plataforma con toast.

### Layout dentro del simulador
- `TrainingBanner` arriba.
- Header del flujo: título traducido + botón **"Salir"** que vuelve al hub de la plataforma.
- Body: chrome de la plataforma + form actual.
- Footer del flujo: indicador de paso (`paso n/N`) + tooltip pedagógico (toggleable).

---

## 3. Modelo de datos

### 3.1 `Account` (localStorage, Zustand)

```ts
type Platform = 'google' | 'instagram' | 'facebook' | 'bank';

type Account = {
  id: string;                    // uuid v4
  platform: Platform;
  createdAt: number;             // epoch ms
  updatedAt: number;

  profile: {
    firstName: string;
    lastName?: string;           // Insta puede no pedirlo
    birthdate?: string;          // ISO yyyy-mm-dd; obligatorio Google/FB/Banco
    gender?: 'female' | 'male' | 'other' | 'prefer_not';
    country?: string;            // ISO-3166 alpha-2
  };

  identity: {
    email?: string;              // Google, FB, Banco
    username?: string;           // Instagram
    phone?: string;              // E.164; Insta/FB opcional, Banco obligatorio
  };

  password: {
    hash: string;                // SHA-256(salt + plaintext)
    salt: string;                // 16 bytes hex
    strength: 0 | 1 | 2 | 3 | 4; // zxcvbn-ts score al momento de crear
    createdAt: number;
    history: { hash: string; salt: string; at: number }[]; // últimas 5
  };

  recovery: {
    email?: string;
    phone?: string;
  };

  totp: {
    enabled: boolean;
    secret?: string;             // base32 si enabled. Banco enabled=true forzado.
    enabledAt?: number;
  };

  loginHistory: {
    at: number;
    success: boolean;
    reason?: 'wrong_password' | 'unknown_account' | 'mfa_failed' | 'mfa_passed';
    suspicious?: boolean;        // Google: trigger aleatorio
  }[];

  inbox: {
    id: string;
    kind: 'sms' | 'email';
    subject?: string;            // email
    code?: string;               // 6 dígitos para recovery
    body?: string;
    at: number;
    read: boolean;
  }[];
};
```

### 3.2 Store

`stores/accounts-store.ts` — Zustand + persist middleware en `localStorage` con key `safia.accounts.v1`. API:

```ts
type AccountsStore = {
  accounts: Account[];
  byPlatform(p: Platform): Account[];
  getById(id: string): Account | undefined;
  create(a: NewAccountInput): Account;            // valida unicidad email/username
  update(id: string, patch: Partial<Account>): void;
  changePassword(id: string, newPlaintext: string): { ok: true } | { ok: false; reason: 'reused' };
  enableTotp(id: string, secret: string): void;
  disableTotp(id: string): void;                  // throws si platform === 'bank'
  pushInbox(id: string, msg: Omit<InboxMsg, 'id' | 'at' | 'read'>): InboxMsg;
  recordLogin(id: string, entry: LoginAttempt): void;
  remove(id: string): void;
  reset(): void;                                  // útil para QA
};
```

Store exporta selectores estables (referencias) para evitar rerenders innecesarios.

### 3.3 Migración desde lo actual

`stores/practice-accounts-store.ts` queda obsoleto. No se hace migración de datos: el playground actual es de práctica, los usuarios no esperan persistencia. Limpieza al primer arranque tras deploy: si existe la key vieja `safia.practice-accounts`, se borra silenciosamente.

### 3.4 Hash de contraseñas

`lib/password.ts`:

```ts
export async function hashPassword(plaintext: string): Promise<{ hash: string; salt: string }>;
export async function verifyPassword(plaintext: string, hash: string, salt: string): Promise<boolean>;
export function strength(plaintext: string): 0 | 1 | 2 | 3 | 4;  // zxcvbn-ts
```

- Implementación: `crypto.subtle.digest('SHA-256', salt+plaintext)` (Web Crypto, browser-native, sin deps).
- Salt: 16 bytes random vía `crypto.getRandomValues`.
- Es deliberadamente débil vs. PBKDF2/argon2 — lo importante pedagógicamente es **no guardar plaintext**, no resistencia real (los hashes nunca salen del navegador).

### 3.5 TOTP

`lib/totp.ts` — wrapper sobre `otpauth` (npm).

```ts
export function generateSecret(): string;                 // base32, 20 bytes
export function otpauthUri(opts: { secret; label; issuer }): string;
export function verifyTotp(secret: string, code: string, window?: 1): boolean;
```

QR del `otpauth://` se renderiza con `qrcode` (npm) en `<canvas>` sin red.

---

## 4. FlowSpec engine

Motor declarativo único; cada flujo es un objeto.

### 4.1 Tipos

```ts
type FieldType =
  | 'text' | 'email' | 'username' | 'password' | 'newPassword'
  | 'date' | 'phone' | 'country' | 'gender' | 'select' | 'mfa' | 'recoveryCode';

type FieldSpec = {
  name: string;                       // clave en `formData`
  type: FieldType;
  required?: boolean;
  validate?: (value: string, ctx: FlowCtx) => string | null; // null = ok, string = i18n key
  i18n: { label: string; placeholder?: string; help?: string };
  autocompleteSuggestion?: (ctx: FlowCtx) => string;          // Google sugiere email
};

type ScreenSpec = {
  id: string;
  title: string;                      // i18n key
  subtitle?: string;
  fields: FieldSpec[];                // 1 campo en Google, varios en Banco
  cta: { primary: string; secondary?: string };
  next: (data: FlowData, ctx: FlowCtx) => string | 'done'; // id de la próxima screen
  tip?: string;                       // tooltip pedagógico
};

type FlowSpec = {
  id: 'create' | 'login' | 'change-password' | 'recover' | 'totp';
  platform: Platform;
  screens: ScreenSpec[];
  onComplete: (data: FlowData, ctx: FlowCtx) => void;        // mutaciones al store
};
```

`FlowCtx` expone: `account?`, `accountsStore`, `t` (next-intl), `router`, `searchParams`.

### 4.2 Runner

`features/simulator/engine/FlowRunner.tsx`:

- Lee `FlowSpec`, navega `screens` en orden controlado por `screen.next`.
- Renderiza chrome de plataforma (componente provisto por la plataforma).
- Animación: slide horizontal entre pantallas (Framer Motion, `x: 20 → 0`).
- `<form noValidate onSubmit={...}>` siempre. Validación propia, mensajes traducidos.
- Cada submit: `e.preventDefault()` + `e.stopPropagation()` + valida + avanza.
- Botón **Salir** sticky → confirmación si hay datos no guardados.
- Indicador `Paso k de N`.

### 4.3 Validaciones reales (helpers en `lib/validations.ts`)

- `email`: RFC 5322 simplificado.
- `phone`: `libphonenumber-js` (~25KB gzip; aceptable porque cubre los 3 idiomas).
- `username` (Insta): `^[a-z0-9._]{3,30}$`, único en localStorage para esa plataforma.
- `password`: longitud ≥ 8 (Banco ≥ 12), strength ≥ 2 (Banco ≥ 3), no en historial.
- `birthdate`: edad ≥ 13.
- `recoveryCode`: 6 dígitos, match contra `inbox` reciente (≤ 10 min).
- `mfa`: `verifyTotp(secret, code, window=1)`.

---

## 5. Plataformas

Cada plataforma vive en `features/simulator/platforms/<platform>/`:
- `index.ts` — exporta `flows: FlowSpec[]`.
- `chrome.tsx` — componentes de chrome (logo, fondo, tipografía, transiciones específicas).
- `flows/{create,login,change-password,recover,totp}.ts`.

### 5.1 Google
- **Crear cuenta** (~7 pantallas): nombre + apellido → fecha nacimiento + género → email propuesto (sugerencia automática a partir del nombre, validación de disponibilidad contra localStorage) → contraseña + confirmación → teléfono recovery (opcional, con explicación de por qué importa) → email recovery (opcional) → revisar y aceptar términos.
- Layout: 1 campo por pantalla, slide horizontal, branding pixel-accurate (logo G-o-o-g-l-e multicolor, tipografía Roboto via system fallback, botón azul `#1a73e8`).
- **Login**: email → contraseña → (si suspicious aleatorio 25%) verificación adicional → (si totp) código.
- **Cambiar pass autenticada**: pass actual → pass nueva + confirmación.
- **Recover**: email → "te enviamos un código" (push a `inbox`, banner pedagógico) → introduce código → redirige a change-password.
- **2FA**: muestra QR + secret legible → pide código de verificación → guardado.
- **Login suspicious**: bloquea con "Verificar que eres tú", pide código del teléfono recovery.

### 5.2 Instagram
- **Crear cuenta** (~5 pantallas): teléfono o email → nombre → username (con validación de disponibilidad y sugerencias auto) → contraseña → fecha de nacimiento.
- Branding: gradiente rosa-naranja del logo, tipografía sans, fondo blanco.
- 2FA opcional con TOTP. Recovery por SMS.

### 5.3 Facebook
- **Crear cuenta** (~5 pantallas): nombre + apellido → email o teléfono → contraseña → fecha → género.
- Branding: azul `#1877f2`.
- 2FA opcional. Recovery por email *o* "amigos de confianza" (simulado: muestra 3 nombres, escoger 1, "se les envió un código").

### 5.4 Banco (SecureBank)
- **Crear cuenta** (~6 pantallas): identificación nacional (DNI/cédula con validación por país) → nombre completo → email → teléfono → contraseña fuerte (requisitos visibles en vivo: longitud ≥12, mayúsculas, dígitos, símbolos, no diccionario) → **2FA obligatorio** (TOTP setup forzado antes de finalizar).
- Branding: azul oscuro `#0a2540`, sobrio, tipografía serif para cabeceras.
- Login: pide MFA *en cada login*. Suspicious activity más estricta.
- Cambiar pass: requiere MFA además de pass actual.
- 2FA disable: bloqueado con mensaje "tu banco no permite desactivar 2FA por seguridad".

---

## 6. Centro de cuentas (`/[locale]/accounts`)

### 6.1 Estado vacío
- Hero corto: "Tu centro de cuentas está vacío." + sub: "Crea tu primera cuenta de práctica para empezar."
- Grid de plataformas (4 cards) → click lleva a `/simulator/<platform>/create`.

### 6.2 Estado con cuentas
- Header: total de cuentas + botón "Crear nueva cuenta" (abre selector de plataforma).
- Lista (cards). Cada card muestra:
  - Avatar con iniciales (color generado de `id` para que sea estable).
  - Etiqueta de plataforma (logo pequeño).
  - Email/username principal.
  - **Indicador de fortaleza de pass** (4 barras coloreadas según `strength`).
  - **Badge 2FA**: candado verde si on, gris si off.
  - Última actividad: "último login: hace X · n intentos fallidos recientes".
  - Menú `⋯`: Iniciar sesión, Cambiar contraseña, Activar/Desactivar 2FA, Recuperar acceso, **Borrar cuenta** (con confirmación).

### 6.3 Filtros y orden
- Filtro por plataforma (chips).
- Orden por: más reciente (default), plataforma, fortaleza ascendente.

### 6.4 Bandeja simulada (post-MVP, declarado aquí para no romper modelo)
La struct `inbox` ya existe en el modelo para que la UI de v1.1 pueda renderizarla sin migración.

---

## 7. i18n

### 7.1 Locales
- `es` (default), `en`, `pt`. Mover `messages/es.json`, `messages/en.json` y crear `messages/pt.json` en paralelo.
- `lib/i18n/config.ts` debe listar `['es','en','pt']`.
- Slugs de ruta en inglés (no se localizan), UI sí.

### 7.2 Estrategia de mensajes
- Namespace `accounts.*` para el centro.
- Namespace `simulator.<platform>.<flow>.<screen>.*` para cada pantalla.
- Namespace `validation.*` único compartido (mensajes de error reutilizables).
- Namespace `tooltips.*` para tooltips pedagógicos.

### 7.3 Validaciones traducidas
- `<form noValidate>` para suprimir UI nativa del browser.
- Tooltips de error custom posicionados bajo cada input.

---

## 8. Stack — qué se mantiene, reescribe, agrega, oculta

### Se mantiene
- Next.js 16 (App Router, Turbopack), React 19, TypeScript strict.
- Tailwind v4, Framer Motion, next-intl, Zustand.
- `components/` (primitives), `features/landing/*` (parcial), `features/simulator/TrainingBanner.tsx`.
- Supabase **solo para newsletter**.
- Hooks de seguridad / scripts (`pnpm generate-manifest` queda; aunque las MDX no se servirán en MVP, no se borra).

### Se reescribe
- `features/simulator/SimulatorShell.tsx`, `platforms.tsx`, `PracticeAccountManager.tsx`, `SimulatorTooltip.tsx` → reemplazados por engine + plataformas declarativas.
- `app/[locale]/simulator/page.tsx`, `[platform]/page.tsx` → nuevas rutas (§2).
- `stores/practice-accounts-store.ts` → `accounts-store.ts`.

### Se agrega
- `features/accounts/` (centro).
- `features/simulator/engine/{FlowRunner,types,validations}.ts`.
- `features/simulator/platforms/{google,instagram,facebook,bank}/`.
- `lib/totp.ts`, `lib/password.ts`, `lib/validations.ts`.
- Deps: `otpauth`, `qrcode`, `zxcvbn-ts`, `libphonenumber-js`. Pinneadas, escaneadas con `pnpm audit` antes de mergear.
- `messages/pt.json`.

### Se oculta (no se borra; archive branch `archive/pre-mvp`)
- Rutas `/[locale]/courses`, `/roadmap`, `/profile`, `/cert`, `/auth/*`, `/api/auth/*` → eliminadas del nav y del build via redirect a `/accounts` con `notFound()`.
- `lib/auth/*`, `auth.config.ts` → mantenidos en disco para v1.1, no importados por nada.
- `content/modules/*` → mantenidos en disco; `content/manifest.json` no se sirve.
- `stores/progress-store.ts` → mantenido pero no importado por simulador (futuro).

### Build / deploy
- Vercel, HTTPS por default.
- Variables: `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (solo newsletter), `SUPABASE_ANON_KEY` (no requerido si no hay client-side).
- `next.config.ts`: headers de seguridad consistentes (`Content-Security-Policy: frame-ancestors 'none'` global; `robots` en metadata por página).

---

## 9. Test plan (mínimo para shipping)

- **Unit**: `password.ts` (hash determinista con mismo salt; verify ok/fail), `totp.ts` (verify con códigos generados con el mismo secret), validators críticos.
- **Integration**: store — crear cuenta, no permitir email duplicado en misma plataforma, cambiar pass rechaza reuso, disable 2FA throw en banco.
- **E2E (manual gate, no Playwright en MVP)**: por cada plataforma, recorrer los 5 flujos, ~30 min total. Lista de QA en `docs/superpowers/qa/2026-04-25-mvp-checklist.md` como output post-implementación.
- **Sec smoke**: `grep -rE "fetch\(|axios|XMLHttpRequest|sendBeacon" features/simulator/` → debe estar vacío. Hook ya existente debería bloquearlo.

---

## 10. Fases de implementación

1. **Foundations**: deps, `accounts-store`, `lib/{password,totp,validations}`, FlowSpec types, locale `pt` esqueleto, ocultar nav de cursos/roadmap/perfil/cert.
2. **Centro de cuentas**: `/[locale]/accounts`, lista + estado vacío + acciones por cuenta.
3. **Google completo**: 5 flujos + recover, plataforma de referencia.
4. **Instagram, Facebook, Banco**: replicar patrón.
5. **Pulido UX e i18n**: `noValidate`, tooltips traducidos, exit button, animaciones, copy fino.
6. **Landing recortada + QA**: hero CTA → `/accounts`, quitar `ModulesPreview` y `HowItWorks`, build limpio, recorrer checklist QA.

---

## 11. Decisiones tomadas (registro)

- **Modelo "creación habilita login"** (Opción A de brainstorm). No hay login sin creación previa.
- **Realismo máximo, validaciones reales** (Opción A).
- **Códigos SMS/email simulados con banner pedagógico** (Opción A); bandeja en modelo para v1.1.
- **TOTP real** (RFC 6238, `otpauth`); QR escaneable con apps reales.
- **Cambio de pass por dos vías** (autenticada y olvidé).
- **Variantes de login**: pass incorrecta, cuenta inexistente, MFA, actividad sospechosa.
- **UX del centro**: decisión delegada a implementación, sin más rondas de spec.
- **Phishing fuera del MVP**.
- **Auth fuera del MVP** (todo localStorage).
- **Plataformas**: Google, Instagram, Facebook, Banco. Confirmado.
- **Locales**: es / en / pt desde día 1.
