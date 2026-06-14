import { z } from "zod";

export const basicDataSchema = z.object({
  documentType: z.enum(["CC", "CE", "NIT", "PP"], "Por favor selecciona un tipo de documento"),
  documentNumber: z
    .string()
    .min(5, "El número de documento debe tener al menos 5 caracteres")
    .max(20, "El número de documento no puede tener más de 20 caracteres")
    .regex(/^[0-9A-Za-z-]+$/, "El número de documento contiene caracteres no válidos"),
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "El nombre contiene caracteres no válidos"),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido es demasiado largo")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "El apellido contiene caracteres no válidos"),
  phone: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(15, "El teléfono no puede tener más de 15 dígitos")
    .regex(/^[0-9+\-\s()]+$/, "El formato del número de teléfono no es válido"),
  email: z
    .string()
    .email("Por favor ingresa un correo electrónico válido")
    .max(200, "El correo electrónico es demasiado largo"),
  city: z
    .string()
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "El nombre de la ciudad es demasiado largo"),
});

export type BasicDataFormValues = z.infer<typeof basicDataSchema>;
