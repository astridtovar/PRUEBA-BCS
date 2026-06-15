# BCS — Micrositio de Solicitud Digital de Crédito

Prueba técnica para el rol de **Desarrollador Frontend Experto**.  
Micrositio de originación digital de crédito de libre destino, construido con Next.js 16 App Router, NestJS, TypeScript.

---

## Stack


| Capa            | Tecnología                                        |
| --------------- | ------------------------------------------------- |
| Frontend        | Next.js 16.2.9 (App Router), React 19, TypeScript |
| Estilos         | Tailwind CSS v4, shadcn/ui v4                     |
| Formularios     | React Hook Form + Zod v4                          |
| Estado wizard   | Zustand v5 + sessionStorage persist               |
| Data fetching   | TanStack Query v5 + native fetch                  |
| Backend         | NestJS, almacenamiento en memoria                 |
| Tests unitarios | Jest + React Testing Library                      |
| Tests E2E       | Playwright                                        |
| Dev runner      | concurrently                                      |
| Contenedores    | Docker + Docker Compose                           |


---

## Demo desplegada

| Servicio  | URL                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------- |
| Frontend  | [https://steadfast-intuition-production-3fb1.up.railway.app](https://steadfast-intuition-production-3fb1.up.railway.app) |
| Backend   | [https://caring-radiance-production.up.railway.app](https://caring-radiance-production.up.railway.app)           |
| Swagger   | [https://caring-radiance-production.up.railway.app/api/docs](https://caring-radiance-production.up.railway.app/api/docs) |

Desplegado en Railway con dos servicios independientes (monorepo). Variables de entorno configuradas por servicio.

---

## Ejecución local (sin Docker)

### Requisitos

- Node.js 20+
- npm 10+

### 1. Instalar dependencias

```bash
# Raíz del proyecto
npm install

# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### 2. Variables de entorno

```bash
# frontend/.env.local (ya incluido en el repo como .env.example)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Levantar ambos servicios

```bash
# Desde la raíz
npm run dev
```

Frontend: [http://localhost:3000](http://localhost:3000)  
Backend: [http://localhost:4000](http://localhost:4000)  
Swagger: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## Ejecución con Docker Compose

```bash
docker-compose up --build
```

Frontend: [http://localhost:3000](http://localhost:3000)  
Backend: [http://localhost:4000](http://localhost:4000)

Para detener:

```bash
docker-compose down
```

---

## Tests

### Unitarios / Integración (Jest + RTL)

```bash
cd frontend
npm test                 # run once
npm run test:watch       # watch mode
npm run test:coverage    # with coverage report
```

Suites: 7 | Tests: 52 | Cobertura: schemas, store, wizard steps, dialog

### E2E (Playwright)

Requiere que el backend esté corriendo en `:4000`.

```bash
cd frontend
npm run test:e2e         # headless
npm run test:e2e:ui      # interactive UI mode
```

Flujos cubiertos:

1. Happy path completo (landing → wizard → confirmación)
2. Guardar borrador y retomar desde la lista
3. Abandonar solicitud con validación de motivo
4. Error técnico de simulación (monto alto)

---

## Historias técnicas

### Historia 1 — Estrategia de renderizado y experiencia del wizard multi-paso

**Como** solicitante de crédito,  
**Quiero** completar mi solicitud a través de un formulario guiado en pasos claros,  
**Para** entender en qué punto del proceso estoy y poder corregir información antes de enviar.

**Criterios de aceptación:**

- [ ] Las páginas de contenido estático (`/`, `/applications`, `/applications/[id]`) son Server Components de Next.js App Router; solo los componentes interactivos del wizard declaran `"use client"`, minimizando el JS enviado al cliente
- [ ] El wizard muestra un indicador visual de progreso (`WizardProgress`) con los 5 pasos y el paso activo resaltado
- [ ] El botón "Back" vuelve al paso anterior sin perder los datos ya ingresados ni relanzar peticiones al backend
- [ ] La selección de canal (`SELF_SERVICE` / `ASSISTED`) en el paso 1 usa `role="radiogroup"` y `role="radio"` para comunicar la estructura al lector de pantalla
- [ ] Los campos con error muestran `aria-invalid="true"` y están vinculados al mensaje de error mediante `aria-describedby`; el mensaje de error usa `role="alert"` para ser anunciado automáticamente
- [ ] Al completar el paso de resumen y confirmar, el usuario ve confirmación del estado final (`PENDING_VALIDATION` o `FINALIZED`) y es redirigido a la lista

**Consideraciones de seguridad:**

- Los datos del formulario persisten solo en `sessionStorage` (no `localStorage`), limitando la exposición a la sesión actual del navegador y evitando que datos financieros queden accesibles entre sesiones
- El `applicationId` generado por el backend en el paso 1 se almacena en el store de Zustand; las operaciones `PATCH` y `POST` subsiguientes usan ese ID, sin exponer datos personales en la URL
- El campo de consentimiento de tratamiento de datos (`dataProcessingAccepted`) es obligatorio en el schema Zod del paso 3; el formulario no puede avanzar sin activarlo

---

### Historia 2 — Validación de formularios con retroalimentación accesible

**Como** solicitante,  
**Quiero** recibir retroalimentación inmediata y comprensible si ingreso datos incorrectos o incompletos,  
**Para** corregir errores antes de enviarlos al servidor y no perder tiempo en rechazos evitables.

**Criterios de aceptación:**

- [ ] Los formularios usan `noValidate` para desactivar la validación nativa del navegador y delegar el control completamente a React Hook Form + Zod
- [ ] Los errores se muestran al perder el foco (blur) sobre un campo o al intentar avanzar de paso; nunca de forma preventiva mientras el usuario escribe
- [ ] El número de documento acepta mínimo 5 y máximo 20 caracteres alfanuméricos
- [ ] El teléfono acepta entre 7 y 15 caracteres (dígitos, espacios, paréntesis, `+`)
- [ ] El correo electrónico es validado por Zod como email RFC-compatible
- [ ] Los gastos mensuales no pueden igualar ni superar los ingresos mensuales (validación cross-field con `.refine()` en el schema de datos financieros)
- [ ] El plazo debe ser un entero entre 6 y 120 meses
- [ ] El motivo de abandono en el `AbandonDialog` debe tener mínimo 5 caracteres antes de habilitar la confirmación

**Consideraciones de seguridad:**

- La validación del cliente es complementaria: el backend NestJS aplica las mismas reglas mediante `class-validator` con `ValidationPipe` global (`whitelist: true`, `transform: true`). Ningún payload malformado puede insertarse en el almacenamiento eludiendo el frontend
- Los campos de monto e ingresos se muestran formateados como moneda COP en la UI, pero el modelo de datos almacena y transmite números crudos, evitando inyección mediante strings de formato
- La transformación automática de `ValidationPipe` (`transform: true`) convierte los campos numéricos que llegan como string (desde `multipart/form-data`) al tipo correcto antes de cualquier lógica de negocio

---

### Historia 3 — Integración frontend-backend: simulación de oferta con trazabilidad

**Como** solicitante,  
**Quiero** recibir una respuesta clara sobre la viabilidad de mi crédito (aprobada, rechazada o con error técnico),  
**Para** tomar una decisión informada sobre si continuar, modificar o abandonar mi solicitud.

**Criterios de aceptación:**

- [ ] Al montar el paso de simulación, el sistema lanza automáticamente `POST /applications/:id/simulate-offer` y muestra un spinner durante la evaluación
- [ ] Si el monto solicitado es menor a $5.000.000: resultado `VIABLE` — se muestran monto aprobado, cuota mensual, plazo y tasa (1,45 % E.A.) en un card de confirmación
- [ ] Si el monto está entre $5.000.000 y $20.000.000: resultado `NOT_VIABLE` — se muestra el motivo de rechazo con opción de volver al paso de datos financieros para ajustar
- [ ] Si el monto supera $20.000.000: el backend retorna HTTP 502; el frontend muestra un mensaje de error temporal genérico y un botón "Reintentar" que relanza la petición
- [ ] Cada llamada a la API incluye el header `X-Correlation-Id` generado con `crypto.randomUUID()` en el cliente (`api-client.ts`); el `api-client` registra `correlationId`, `method`, `url` y `status` en cada petición y en cada error mediante `logger.ts`
- [ ] El backend registra los eventos `SIMULATION_REQUESTED`, `SIMULATION_SUCCESS`, `SIMULATION_NOT_VIABLE` o `SIMULATION_ERROR` con metadata (monto, tasa, cuota según aplique); todos visibles en `GET /applications/:id/events` y en el `EventTimeline` del detalle

**Consideraciones de seguridad:**

- El endpoint `simulate-offer` valida que la solicitud esté en estado `DRAFT`; cualquier intento desde otro estado retorna HTTP 400, impidiendo manipulación de estado desde el cliente
- El `X-Correlation-Id` es generado íntegramente en el cliente sin datos del usuario; sirve para correlacionar logs del `api-client` con la petición en cuestión. El backend lo recibe vía CORS (`allowedHeaders: ['X-Correlation-Id']`) pero no lo propaga en su capa de logs
- Los errores HTTP del servidor (502, 400, 404) son interceptados en `api-client.ts` y traducidos a mensajes amigables en la UI; el stack técnico nunca se expone al usuario
- El backend aplica CORS estricto, permitiendo solicitudes solo desde `localhost:3000` y `frontend:3000` (entorno Docker)

---

## Decisiones técnicas

### Por qué TanStack Query en lugar de fetch directo en Client Components

Manejo automático de caching, revalidación, estados de carga/error y deduplicación de peticiones. La alternativa sería gestionar `useState`/`useEffect` manualmente, propenso a race conditions.

### Por qué Zustand con sessionStorage

El wizard multi-paso necesita estado que sobreviva navegación entre páginas pero no entre sesiones. `localStorage` sería demasiado persistente para datos financieros sensibles; `useState` se pierde al navegar. `sessionStorage` es el balance correcto.

### Por qué Zod

Zod v4 tiene una API más limpia con mensajes de error integrados directamente en los métodos (e.g., `z.number("mensaje")`). 