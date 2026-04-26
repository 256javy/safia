# Safia MVP — Dogfood walkthrough (Claude on Chrome)

**Goal:** end-to-end QA del MVP del playground, en un navegador real, con TOTP escaneable y persistencia localStorage.

---

## Setup

**IMPORTANTE — Issue conocido**: Next 16 + Turbopack tiene un bug ("Module factory not available") en hidratación de las páginas del simulador en `pnpm dev` (puerto 3000). El landing y el centro de cuentas funcionan, pero al entrar a `/simulator/<plataforma>/<flow>` la página falla en hidratar.

**Workaround**: corre la build de producción en otro puerto:
```bash
pnpm build && pnpm next start -p 3100
```
Y apunta el dogfood a `http://localhost:3100` en lugar de `:3000`. Los E2E pasan 7/7 contra el prod build.

- Locale por defecto: `/es`.
- Antes de empezar: abre DevTools → Application → Local Storage → borra la key `safia.accounts.v1` para arrancar limpio.

## Cómo reportar

Mantén una nota incremental con este formato:

```
[STATUS] <ROUTE> — <flow> — PASS|FAIL|ISSUE
  - evidencia (texto que viste, screenshot path, error en consola)
  - severidad: CRITICAL | HIGH | MEDIUM | LOW (cosmético)
```

Al final entrega: **veredicto** (SHIP / SHIP-WITH-FIXES / DO-NOT-SHIP) + **top 5 issues** ordenados por severidad + **lo que más me gustó / menos me gustó**.

---

## Plan de pruebas

### A. Landing — `/es`

1. Visita `/es`. Verifica:
   - Hero con título y CTA.
   - Botón primario lleva a `/es/accounts`.
   - Botón secundario lleva a `/es/simulator/google`.
   - Hay sección de "síguenos" / redes sociales (post-redesign).
   - **No hay** sección de email/newsletter.
2. Cambia el idioma a `en` y `pt` con el switch. Verifica que la copy traduce.

### B. Centro de cuentas vacío — `/es/accounts`

1. Hub debe mostrar estado vacío con grid de 4 plataformas.
2. Click cada plataforma → debe llevar a `/es/simulator/<platform>/create`.

### C. Google — los 5 flujos

#### C.1 Crear cuenta
1. Recorre 6 pantallas: nombre → fecha+género → email (con sugerencia automática) → contraseña + confirmar → teléfono recovery (skipea con "Omitir") → revisar.
2. **Verifica**: en pantalla de email, escribe sólo el nombre y observa si la sugerencia se autocompleta.
3. **Verifica**: contraseña corta (<8) o débil debe mostrar error inline.
4. **Verifica**: contraseñas que no coinciden → error "no coinciden".
5. Confirma. Debe redirigir a `/es/accounts` y aparecer la cuenta en el grid.
6. **Verifica en localStorage**: `safia.accounts.v1` tiene un objeto con `password.hash` y `password.salt` — **nunca** plaintext.

#### C.2 Login
1. Desde el centro de cuentas, abre menú `⋯` de la cuenta Google → "Iniciar sesión".
2. Pantalla email: escribe un email distinto al guardado → debe error "no existe la cuenta".
3. Vuelve atrás (botón salir) y entra de nuevo. Email correcto → siguiente.
4. Pantalla password: escribe contraseña incorrecta → error inline. **No debe avanzar**.
5. Password correcta → debe llevar a `verify` o, **con probabilidad ~25%**, a la pantalla `suspicious` con código.
6. Si llega a suspicious: revisa `inbox` en localStorage de la cuenta — debe haber un SMS con `code`. Copia y pega el código → siguiente.
7. Pantalla "verify" muestra éxito. Click "Listo" → vuelve al hub de la plataforma.

#### C.3 Cambiar contraseña (vía autenticada)
1. Desde el centro, "Cambiar contraseña" en la cuenta.
2. Pantalla 1: pass actual incorrecta → error.
3. Pass actual correcta → siguiente.
4. Nueva pass = misma que la actual → debe rechazar como reutilizada (verifica el mensaje al volver al hub o intentando guardar). Como mínimo: rechazar al guardar.
5. Nueva pass diferente y fuerte → guardar → vuelta al hub. Verifica en localStorage que `password.history` ahora tiene 1 entrada.

#### C.4 Recover (olvidé mi contraseña)
1. Desde el hub, "Recuperar acceso".
2. Email correcto → push a inbox + "te enviamos un código".
3. Lee el código en localStorage `inbox` de la cuenta y pégalo.
4. Debe redirigir a `change-password?via=forgot` (1 sola pantalla, sin pedir pass actual).
5. Pon una pass nueva diferente → guarda. Vuelve al hub.

#### C.5 TOTP enable
1. "Activar 2FA" desde el hub.
2. Pantalla `scan`: aparece un QR + clave manual (espacios cada 4 chars).
3. **Escanea el QR con Google Authenticator / Authy / 1Password real**. Verifica que la app reconoce el issuer "Google (Safia)" y empieza a generar códigos.
4. Pantalla `verify`: introduce el código actual de la app → debe activarse.
5. Vuelve al hub. La cuenta debe mostrar badge 2FA verde (candado on).
6. Cierra sesión y haz login de nuevo: ahora la pantalla `mfa` debe pedirte el código TOTP. Introduce uno válido → entra.
7. Introduce uno inválido → error.

#### C.6 TOTP disable
1. "Desactivar 2FA" desde el hub.
2. Confirma con pass actual → 2FA off.

### D. Instagram — repite C.1 a C.6

- Diferencias esperadas:
  - Identifier es `username` (con sugerencia desde fullName), email opcional.
  - Login acepta email O username.
  - Branding: gradiente rosa-naranja en logo, botón azul Instagram.
  - 2FA opcional.

### E. Facebook — repite C.1 a C.6

- Diferencias esperadas:
  - Branding: azul `#1877f2`, wordmark "facebook" en minúsculas.
  - Crear cuenta tiene 5 pantallas: nombre+apellido → email → password → fecha → género (obligatorio).
  - 2FA opcional.

### F. Bank (SecureBank) — flujos especiales

#### F.1 Create
1. Recorre 7 pantallas: DNI → nombre → email → teléfono → contraseña fuerte (≥12, strength≥3) → **TOTP scan (QR + clave)** → **TOTP verify (código)**.
2. **Critical**: la cuenta no se crea hasta verificar TOTP. Confirma que `account.totp.enabled === true` en localStorage tras crear.
3. Verifica que pass <12 caracteres se rechaza, y que pass como `Password123!` (strength<3) también se rechaza.

#### F.2 Login
1. Pide email → password → **siempre** mfa (no es opcional).
2. Sin código TOTP correcto → no entra.

#### F.3 Change password (vía auth)
1. Debe pedir pass actual + **mfa** + nueva pass. 3 pantallas.

#### F.4 TOTP disable
1. Click "Desactivar 2FA" desde el hub del banco.
2. Debe mostrar pantalla "Tu banco no permite desactivar 2FA" sin posibilidad de continuar.

### G. Multi-cuenta y persistencia

1. Crea 2 cuentas Google distintas → ambas aparecen en el hub.
2. Cierra el navegador (no incógnito) y reabre `/es/accounts` → ambas siguen.
3. Crea un Instagram y un Bank más. Verifica filtros (chips por plataforma) y orden (recent / platform / weakest).

### H. Seguridad — checks no negociables

Mientras navegas, ten DevTools → Network abierto. **Ningún request** debe salir de los simuladores cuando escribes pass o submits, salvo:
- Carga inicial de la page (HTML/JS/CSS de Next).
- Llamadas a `_next/...` (HMR en dev).
- Locale assets.

Específicamente:
- No debe haber POST con tu password.
- No debe haber XHR a dominios externos.
- En la consola de DevTools, escribe:
  ```js
  document.querySelector('[role="alert"]').remove()
  ```
  El TrainingBanner debe **reaparecer** en máx 2 segundos (interval re-injection).
- View source de cualquier `/simulator/*` → debe contener `<meta name="robots" content="noindex,nofollow">`.

### I. Edge cases

1. Visita `/es/simulator/google/login?account=NOEXISTE` → debe mostrar pantalla "Cuenta no encontrada" con CTA a salir.
2. Visita `/es/simulator/twitter/create` (plataforma inválida) → "Plataforma no disponible".
3. Click el botón "Salir" mientras un campo está editado a medias → debe pedir confirmación. Cancela → permanece. Acepta → vuelve al hub.

### J. i18n

- Cambia idioma desde el switcher mientras estás en mitad de un flujo. Si rompe (URL queda colgada), nota.
- Verifica que en `pt` y `en` no hay strings sin traducir (`MISSING_MESSAGE` o claves crudas).

---

## Salida final esperada

```markdown
## Veredicto: <SHIP / SHIP-WITH-FIXES / DO-NOT-SHIP>

## Top issues
1. [CRITICAL] ...
2. [HIGH] ...
3. ...

## Lo que más me gustó
- ...

## Lo que menos me gustó
- ...

## Notas adicionales
- ...
```

Tiempo estimado: **30–45 min** si todo va bien, hasta 90 min si hay bugs. Toma screenshots de cualquier cosa rara.
