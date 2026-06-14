# Tests End-to-End (E2E)

Pruebas de extremo a extremo escritas con **Playwright**. Verifican los flujos completos de usuario interactuando con la aplicación desde el navegador, con el backend real corriendo en `localhost:4000`.

## Requisitos previos

- Frontend corriendo en `http://localhost:3000`
- Backend corriendo en `http://localhost:4000`

## Ejecución

```bash
npm run test:e2e
```

---

## Flujos probados

### `happy-path.spec.ts` — Flujo completo de solicitud aprobada

Verifica que un usuario puede completar el wizard de principio a fin y enviar su solicitud cuando el monto solicitado es viable (< $5.000.000 COP).

**Pasos:**
1. Usuario llega a la landing (`/`) y hace clic en el CTA principal
2. **Paso 1 – Canal:** selecciona autogestión y avanza
3. **Paso 2 – Datos personales:** llena nombre, documento, teléfono, email y ciudad
4. **Paso 3 – Datos financieros:** ingresa un monto de $2.000.000 (< $5M → resultado VIABLE)
5. **Paso 4 – Simulación:** ve la oferta preliminar aprobada con `¡Felicitaciones!`
6. **Paso 5 – Resumen:** confirma y envía la solicitud
7. Es redirigido a la lista de solicitudes o al detalle con estado exitoso

---

### `save-draft.spec.ts` — Guardar borrador y retomar

Verifica que una solicitud incompleta queda guardada como `DRAFT` y puede retomarse desde la lista.

**Pasos:**
1. Usuario inicia una nueva solicitud en `/applications/new`
2. Completa el paso de canal y el de datos personales
3. Navega manualmente a `/applications` sin terminar el wizard
4. La lista muestra la solicitud con estado `DRAFT`
5. Al hacer clic en la fila, accede al detalle de la solicitud
6. El detalle muestra el botón "Editar" (disponible solo para borradores)

---

### `abandon.spec.ts` — Abandono con motivo obligatorio

Verifica que un usuario puede abandonar una solicitud desde el resumen, que la validación del motivo se aplica correctamente y que tras confirmar es redirigido.

**Pasos:**
1. Usuario navega hasta el **Paso 5 – Resumen** (repite los pasos 1–4 del happy path)
2. Hace clic en el botón "Abandonar"
3. Se abre un diálogo de confirmación
4. Intenta confirmar sin escribir motivo → aparece error de validación
5. Escribe un motivo válido (≥ 5 caracteres) y confirma el abandono
6. Es redirigido a la lista de solicitudes o al detalle

---

### `simulation-error.spec.ts` — Resultados de simulación según monto

Contiene dos casos que verifican los distintos resultados de la simulación según el monto solicitado.

#### Caso 1: Monto > $20.000.000 → `TECHNICAL_ERROR`
- El paso 4 muestra el bloque de error técnico temporal
- Se muestra el botón "Intentar de nuevo"

#### Caso 2: Monto entre $5.000.000 y $20.000.000 → `NOT_VIABLE`
- El paso 4 muestra el mensaje de solicitud no viable
- No se ofrece una cuota mensual

---

## Tabla resumen

| Archivo | Escenario principal | Resultado esperado |
|---|---|---|
| `happy-path.spec.ts` | Solicitud viable completa | Redirige a lista/detalle exitoso |
| `save-draft.spec.ts` | Abandono mid-wizard | Solicitud queda en `DRAFT`, accesible desde lista |
| `abandon.spec.ts` | Abandono con motivo | Validación requerida; redirige tras confirmar |
| `simulation-error.spec.ts` | Montos alto y medio | Muestra `TECHNICAL_ERROR` y `NOT_VIABLE` respectivamente |

## Helpers compartidos

`helpers.ts` — funciones reutilizables entre specs:
- `fillBasicData(page)` — llena el formulario de datos personales con datos de prueba
- `fillFinancialData(page, amount)` — llena el formulario financiero con el monto indicado
