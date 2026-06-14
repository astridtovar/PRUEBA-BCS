# BCS Credit Digital — Frontend

Micrositio de solicitud de crédito de libre destino. Construido con **Next.js 16 (App Router)** y **TypeScript**.

## Tecnologías

| Herramienta           | Versión | Rol                                              |
| --------------------- | ------- | ------------------------------------------------ |
| Next.js (App Router)  | 16      | Framework React con routing y SSR                |
| React                 | 19      | UI                                               |
| TypeScript            | 5       | Lenguaje                                         |
| Tailwind CSS          | v4      | Estilos utilitarios                              |
| shadcn/ui             | —       | Componentes base (Button, Dialog, Card…)         |
| TanStack Query        | v5      | Estado del servidor: fetch, caché, loading/error |
| Zustand               | v5      | Estado del cliente: wizard multi-paso            |
| React Hook Form + Zod | v7 + v4 | Formularios con validación tipada                |
| Sonner                | —       | Notificaciones toast                             |

## Inicio rápido

Requiere Node.js 20+, npm 10+ y el backend corriendo en `http://localhost:4000`.

```bash
npm install
npm run dev        # http://localhost:3000
```

Otros scripts disponibles:

```bash
npm run build          # Build de producción
npm run lint           # ESLint
npm run test           # Tests unitarios (Jest)
npm run test:watch     # Tests en modo watch
npm run test:coverage  # Reporte de cobertura
npm run test:e2e       # Tests e2e (Playwright)
```

## Estructura del proyecto

```
src/
├── app/                     # Next.js App Router — páginas y rutas
│   ├── layout.tsx
│   ├── page.tsx             # / → Landing
│   └── applications/
│       ├── page.tsx         # /applications → Lista
│       ├── new/page.tsx     # /applications/new → Wizard nueva solicitud
│       └── [id]/
│           ├── page.tsx     # /applications/:id → Detalle
│           └── edit/page.tsx
│
├── features/                # Código organizado por dominio
│   ├── applications/
│   │   ├── components/      # list/, detail/, wizard/ (5 pasos + AbandonDialog)
│   │   ├── hooks/           # useApplications, useApplication, useApplicationMutations
│   │   ├── i18n/            # applications.ts, wizard.ts
│   │   ├── schemas/         # Esquemas Zod por paso del wizard
│   │   ├── services/        # applications.service.ts — llamadas HTTP
│   │   ├── store/           # wizardStore.ts — Zustand + sessionStorage
│   │   └── types/           # application.types.ts
│   └── landing/
│       ├── components/
│       └── i18n/
│
└── shared/                  # Código transversal
    ├── components/          # feedback/, layout/, ui/
    ├── hooks/               # useDebounce
    ├── i18n/                # index.ts exporta `t` con todo el texto de la UI
    ├── lib/                 # api-client.ts, logger.ts
    └── types/               # api.types.ts
```

## Testing

### Tests unitarios — Jest + React Testing Library

Los tests se ubican **junto al archivo que prueban**:

```
schemas/basicData.schema.test.ts        ← reglas Zod campo por campo
schemas/financialData.schema.test.ts    ← incluye validación cruzada gastos > ingresos
store/wizardStore.test.ts               ← ciclo completo del wizard
wizard/AbandonDialog.test.tsx           ← flujo de abandono
wizard/steps/StepBasicData.test.tsx     ← submit, pre-relleno, validación, error inline
wizard/steps/StepFinancialData.test.tsx ← ídem + validación cruzada
wizard/steps/StepSimulation.test.tsx    ← estados VIABLE / NOT_VIABLE / TECHNICAL_ERROR
```

Los tests de componente mockean mutaciones y toast, e inicializan el store directamente para evitar interactuar con widgets complejos en jsdom (ej. el `Select` de shadcn).

### Tests e2e — Playwright

```
e2e/applications/
├── helpers.ts                # fillBasicData / fillFinancialData reutilizables
├── happy-path.spec.ts        # flujo completo canal → simulación → envío
├── save-draft.spec.ts        # guardar borrador y retomar desde la lista
├── abandon.spec.ts           # abandonar con validación de motivo
└── simulation-error.spec.ts  # NOT_VIABLE y TECHNICAL_ERROR (>20M)
```

```bash
npx playwright install   # solo la primera vez
npm run test:e2e
```

## Configuración de entorno

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```
