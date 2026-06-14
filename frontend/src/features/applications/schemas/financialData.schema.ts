import { z } from "zod";

export const financialDataSchema = z
  .object({
    monthlyIncome: z
      .number("Los ingresos mensuales son requeridos")
      .positive("Los ingresos mensuales deben ser mayores a cero")
      .max(100_000_000, "El valor de ingresos mensuales es demasiado alto"),
    monthlyExpenses: z
      .number("Los gastos mensuales son requeridos")
      .min(0, "Los gastos mensuales no pueden ser negativos")
      .max(100_000_000, "El valor de gastos mensuales es demasiado alto"),
    requestedAmount: z
      .number("El monto solicitado es requerido")
      .positive("El monto solicitado debe ser mayor a cero")
      .max(100_000_000, "El monto solicitado supera el máximo permitido"),
    termMonths: z
      .number("El plazo es requerido")
      .int("El plazo debe ser un número entero")
      .min(6, "El plazo mínimo es 6 meses")
      .max(120, "El plazo máximo es 120 meses"),
    creditPurpose: z
      .string()
      .min(5, "Por favor describe el destino del crédito (mínimo 5 caracteres)")
      .max(200, "La descripción es demasiado larga"),
    dataProcessingAccepted: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar el tratamiento de datos para continuar",
    }),
  })
  .refine((data) => data.monthlyExpenses < data.monthlyIncome, {
    message: "Los gastos mensuales no pueden ser iguales o superiores a los ingresos",
    path: ["monthlyExpenses"],
  });

export type FinancialDataFormValues = z.infer<typeof financialDataSchema>;
