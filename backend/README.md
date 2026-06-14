# BCS Credit Digital — Backend

API REST para la gestión de solicitudes de crédito de libre destino. Construida con **NestJS v11** y **TypeScript**.

## Tecnologías


| Herramienta                         | Rol                                 |
| ----------------------------------- | ----------------------------------- |
| NestJS v11 + Express                | Framework HTTP                      |
| TypeScript                          | Lenguaje                            |
| class-validator + class-transformer | Validación y transformación de DTOs |
| @nestjs/swagger                     | Documentación OpenAPI automática    |
| Jest + @nestjs/testing              | Tests unitarios                     |


## Requisitos

- Node.js 20+
- npm 10+

## Instalación y ejecución

```bash
npm install

# Desarrollo con hot-reload
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor escucha en **[http://localhost:4000](http://localhost:4000)** por defecto.  
La documentación interactiva Swagger está disponible en **[http://localhost:4000/api/docs](http://localhost:4000/api/docs)**.

## Scripts disponibles

```bash
npm run start:dev    # Desarrollo con watch mode
npm run build        # Compila TypeScript a dist/
npm run start:prod   # Ejecuta el build compilado
npm run test         # Tests unitarios
npm run test:cov     # Tests con reporte de cobertura
npm run lint         # ESLint con auto-fix
npm run format       # Prettier
```

## Estructura del proyecto

```
src/
├── main.ts                            # Bootstrap: CORS, ValidationPipe global, Swagger
├── app.module.ts                      # Módulo raíz
└── applications/
    ├── applications.module.ts         # Módulo de solicitudes
    ├── applications.controller.ts     # Definición de endpoints HTTP
    ├── applications.service.ts        # Lógica de negocio + store en memoria
    ├── applications.service.spec.ts   # Tests unitarios (~30 casos)
    ├── entities/
    │   └── application.entity.ts      # Tipos TypeScript (Application, eventos, resultados)
    └── dto/
        ├── create-application.dto.ts  # Payload de creación
        ├── update-application.dto.ts  # Payload de actualización parcial
        ├── query-applications.dto.ts  # Parámetros de filtrado en listado
        └── abandon-application.dto.ts # Payload de abandono
```

## API

### Solicitudes


| Método  | Ruta                               | Descripción                               |
| ------- | ---------------------------------- | ----------------------------------------- |
| `POST`  | `/applications`                    | Crea una solicitud en estado `DRAFT`      |
| `GET`   | `/applications`                    | Lista solicitudes con filtros opcionales  |
| `GET`   | `/applications/:id`                | Detalle de una solicitud                  |
| `PATCH` | `/applications/:id`                | Actualiza datos (solo si está en `DRAFT`) |
| `POST`  | `/applications/:id/simulate-offer` | Ejecuta simulación de oferta              |
| `POST`  | `/applications/:id/finalize`       | Finaliza la solicitud                     |
| `POST`  | `/applications/:id/abandon`        | Abandona la solicitud con un motivo       |
| `GET`   | `/applications/:id/events`         | Historial de eventos de la solicitud      |


### Filtros disponibles en `GET /applications`


| Parámetro | Tipo                                                 | Descripción                                   |
| --------- | ---------------------------------------------------- | --------------------------------------------- |
| `status`  | `DRAFT | PENDING_VALIDATION | FINALIZED | ABANDONED` | Filtra por estado                             |
| `channel` | `SELF_SERVICE | ASSISTED`                            | Filtra por canal                              |
| `search`  | `string`                                             | Busca en nombre, apellido, documento y correo |


## Estados y ciclo de vida

```
DRAFT ──────────────────────────────────────────────────► ABANDONED
  │                                                         ▲
  │  (simulación VIABLE)          (simulación no VIABLE     │
  ▼                                o sin simulación)        │
PENDING_VALIDATION ──────────────────► FINALIZED            │
  │                                                         │
  └────────────────────────────────────────────────────────►┘
```

- Una solicitud solo puede modificarse mientras esté en `DRAFT`.
- `FINALIZED` y `ABANDONED` son estados terminales — no se pueden modificar.
- `PENDING_VALIDATION` puede abandonarse pero no re-finalizarse.

## Lógica de simulación

La simulación (`POST /applications/:id/simulate-offer`) evalúa el `requestedAmount`:


| Monto solicitado               | Resultado                                                          | HTTP |
| ------------------------------ | ------------------------------------------------------------------ | ---- |
| Menos de $5.000.000            | `VIABLE` — calcula cuota con fórmula de anualidad al 1,45% mensual | 200  |
| Entre $5.000.000 y $20.000.000 | `NOT_VIABLE` — supera capacidad financiera                         | 200  |
| Más de $20.000.000             | `TECHNICAL_ERROR` — simula falla de sistema externo                | 502  |


Al finalizar una solicitud con resultado `VIABLE`, el estado pasa a `PENDING_VALIDATION`. En cualquier otro caso pasa a `FINALIZED`.

## Trazabilidad de eventos

Cada operación sobre una solicitud registra uno o más eventos auditables:


| Tipo de evento          | Cuándo se genera             |
| ----------------------- | ---------------------------- |
| `CREATED`               | Al crear la solicitud        |
| `UPDATED`               | Al actualizar datos          |
| `DRAFT_SAVED`           | Junto con cada actualización |
| `SIMULATION_REQUESTED`  | Al iniciar una simulación    |
| `SIMULATION_SUCCESS`    | Simulación exitosa (VIABLE)  |
| `SIMULATION_NOT_VIABLE` | Simulación no viable         |
| `SIMULATION_ERROR`      | Error técnico en simulación  |
| `FINALIZED`             | Al finalizar                 |
| `ABANDONED`             | Al abandonar                 |


## Persistencia

Los datos se almacenan en memoria (`Map<string, Application>` dentro del servicio singleton). **Los datos se pierden al reiniciar el servidor.** Esta decisión es intencional para la prueba y no agregar complejidad de una bd.

## Configuración global (main.ts)

- **CORS** habilitado para `http://localhost:3000` (frontend en desarrollo)
- **ValidationPipe** global con `whitelist: true`, `transform: true` y `forbidNonWhitelisted: true`
- **Puerto** configurable por variable de entorno `PORT` (por defecto `4000`)

## Tests

```bash
npm run test        # Ejecuta todos los tests unitarios
npm run test:cov    # Genera reporte de cobertura en /coverage
npm run test:watch  # Modo watch para desarrollo
```

Los tests cubren el `ApplicationsService` directamente, sin levantar el servidor HTTP. Casos incluidos: creación, filtrado, actualización, simulación (tres escenarios de monto), finalización (todos los estados resultantes) y abandono.