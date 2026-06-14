export const wizard = {
  page: {
    backToHome: "Volver al inicio",
    title: "Solicitud de crédito de libre destino",
    subtitle: "Completa los pasos a continuación. Tu progreso se guarda automáticamente.",
  },
  progress: {
    steps: ["Canal", "Tus datos", "Financiación", "Simulación", "Resumen"],
    completed: (label: string) => `${label} (completado)`,
    current: (label: string) => `${label} (actual)`,
  },
  channel: {
    title: "¿Cómo deseas continuar?",
    subtitle: "Selecciona tu canal preferido para iniciar la solicitud.",
    options: {
      selfService: {
        label: "Autogestión",
        description: "Completa tu solicitud de forma independiente a tu propio ritmo.",
      },
      assisted: {
        label: "Asistido",
        description: "Un asesor te acompañará durante todo el proceso.",
      },
    },
    advisorId: {
      label: "ID de asesor (opcional)",
      placeholder: "Ej. ASE-001",
      hint: "Déjalo en blanco si no tienes un asesor asignado.",
      instruction: "Ingresa el ID del asesor si tienes uno.",
    },
    buttons: {
      continue: "Continuar",
      creating: "Creando...",
    },
    errors: {
      createFailed: "No se pudo crear la solicitud. Por favor intenta de nuevo.",
    },
  },
  basicData: {
    title: "Información personal",
    subtitle: "Necesitamos algunos datos básicos para crear tu solicitud.",
    fields: {
      documentType: "Tipo de documento *",
      documentTypePlaceholder: "Selecciona un tipo",
      documentNumber: "Número de documento *",
      documentNumberPlaceholder: "Ej. 12345678",
      firstName: "Primer nombre *",
      firstNamePlaceholder: "Tu primer nombre",
      lastName: "Apellido *",
      lastNamePlaceholder: "Tu apellido",
      phone: "Teléfono móvil *",
      phonePlaceholder: "Ej. 3001234567",
      email: "Correo electrónico *",
      emailPlaceholder: "tu@correo.com",
      city: "Ciudad de residencia *",
      cityPlaceholder: "Ej. Bogotá",
    },
    buttons: {
      back: "Atrás",
      continue: "Continuar",
      saving: "Guardando...",
    },
    errors: {
      saveFailed: "No se pudo guardar tu información. Por favor intenta de nuevo.",
    },
  },
  financialData: {
    title: "Información financiera",
    subtitle: "Ayúdanos a conocer tu perfil financiero para generar la mejor oferta.",
    fields: {
      monthlyIncome: "Ingresos mensuales (COP) *",
      monthlyIncomePlaceholder: "Ej. 3.500.000",
      monthlyExpenses: "Gastos mensuales (COP) *",
      monthlyExpensesPlaceholder: "Ej. 1.500.000",
      requestedAmount: "Monto solicitado (COP) *",
      requestedAmountPlaceholder: "Ej. 2.000.000",
      requestedAmountHint:
        "Menos de $5M: probable viable · $5M–$20M: puede no ser viable · Más de $20M: simulación de error",
      termMonths: "Plazo deseado (meses) *",
      termMonthsPlaceholder: "Ej. 24",
      creditPurpose: "Destino del crédito *",
      creditPurposePlaceholder:
        "Describe cómo usarás el crédito (ej. remodelación del hogar, educación, gastos médicos...)",
      dataConsent:
        "Autorizo el tratamiento de mis datos personales con el fin de evaluar mi solicitud de crédito, de conformidad con la política de protección de datos. *",
    },
    buttons: {
      back: "Atrás",
      simulate: "Simular oferta",
      saving: "Guardando...",
    },
    errors: {
      saveFailed: "No se pudo guardar tu información. Por favor intenta de nuevo.",
    },
  },
  simulation: {
    title: "Oferta preliminar",
    subtitle: "Estamos evaluando tu solicitud para generar un resultado preliminar.",
    loading: {
      label: "Evaluando tu perfil...",
      hint: "Esto solo tomará un momento...",
    },
    viable: {
      title: "¡Felicitaciones! Tienes una oferta preliminar.",
      subtitle: "Sujeta a verificación final de la información.",
      ariaLabel: "Oferta aprobada",
    },
    notViable: {
      title: "No fue posible generar una oferta",
      footnote:
        "Esta es una evaluación preliminar. Puedes modificar los datos de tu solicitud o contactar a un asesor para más información.",
      ariaLabel: "Solicitud no viable",
    },
    technicalError: {
      title: "Error técnico temporal",
      message:
        "Ha ocurrido un error técnico temporal. Por favor intenta de nuevo en unos minutos.",
      tryAgain: "Intentar de nuevo",
      ariaLabel: "Error técnico",
    },
    connectionError: {
      message: "No se pudo conectar con el servicio de evaluación.",
      retry: "Reintentar",
    },
    buttons: {
      back: "Atrás",
      viewSummary: "Ver resumen",
    },
    errors: {
      simulationFailed: "No se pudo ejecutar la simulación. Por favor intenta de nuevo.",
    },
  },
  summary: {
    title: "Resumen de la solicitud",
    subtitle: "Revisa tu información antes de enviar.",
    sections: {
      channel: "Canal",
      personalData: "Datos personales",
      financialData: "Datos financieros",
      simulationResult: "Resultado de simulación",
    },
    simulation: {
      result: "Resultado",
      preApproved: "Preaprobado",
      notViable: "No viable",
      error: "Error",
      reason: "Motivo",
    },
    consent:
      "Al enviar, confirmo que la información proporcionada es precisa y completa. Acepto los términos preliminares de la oferta sujetos a validación completa.",
    buttons: {
      back: "Atrás",
      abandon: "Abandonar",
      submit: "Enviar solicitud",
      submitting: "Enviando...",
    },
    toasts: {
      success: "¡Solicitud enviada con éxito!",
      error: "No se pudo enviar la solicitud. Por favor intenta de nuevo.",
    },
  },
  abandon: {
    title: "Abandonar solicitud",
    description:
      "¿Estás seguro de que deseas abandonar esta solicitud? Esta acción no se puede deshacer. Por favor cuéntanos el motivo.",
    reason: {
      label: "Motivo del abandono *",
      placeholder: "Ej. Ya no necesito el crédito en este momento...",
      error: "Por favor proporciona un motivo de al menos 5 caracteres.",
      counter: (current: number) => `${current}/500`,
    },
    buttons: {
      goBack: "Volver",
      confirm: "Confirmar abandono",
      confirming: "Abandonando...",
    },
    toasts: {
      success: "Solicitud abandonada. Esperamos verte de nuevo.",
      error: "No se pudo abandonar la solicitud. Por favor intenta de nuevo.",
    },
  },
};
