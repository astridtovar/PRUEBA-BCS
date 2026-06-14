export const applications = {
  list: {
    loading: "Cargando solicitudes...",
    error: {
      title: "No se pudieron cargar las solicitudes",
      description: "Verifica tu conexión e intenta de nuevo.",
    },
    empty: {
      filtered: {
        title: "No se encontraron solicitudes",
        description: "Ninguna solicitud coincide con los filtros seleccionados.",
      },
      initial: {
        title: "No se encontraron solicitudes",
        description: "Aún no has iniciado ninguna solicitud.",
        action: "Iniciar solicitud",
      },
    },
    table: {
      columns: {
        applicant: "Solicitante",
        channel: "Canal",
        status: "Estado",
        created: "Creado",
        actions: "Acciones",
      },
      resultsCount: (n: number) =>
        `${n} solicitud${n !== 1 ? "es" : ""} encontrada${n !== 1 ? "s" : ""}`,
      viewApplication: (name: string) => `Ver solicitud de ${name}`,
    },
    header: {
      title: "Mis solicitudes",
      description: "Gestiona y hace seguimiento a todas tus solicitudes de crédito.",
      newApplication: "Nueva solicitud",
    },
  },
  filters: {
    srLabel: "Filtrar solicitudes",
    searchPlaceholder: "Buscar por nombre, documento o correo...",
    allStatuses: "Todos los estados",
    allChannels: "Todos los canales",
    clear: "Limpiar",
    aria: {
      search: "Buscar solicitudes",
      status: "Filtrar por estado",
      channel: "Filtrar por canal",
      clear: "Limpiar todos los filtros",
    },
  },
  detail: {
    loading: "Cargando solicitud...",
    error: {
      title: "No se pudo cargar la solicitud",
      description: "La solicitud puede no existir o hubo un error de conexión.",
    },
    breadcrumb: "Todas las solicitudes",
    sections: {
      personalInfo: "Información personal",
      financialInfo: "Información financiera",
      simulationResult: "Resultado de simulación",
      abandonReason: "Motivo de abandono",
      eventTimeline: "Historial de eventos",
    },
    simulation: {
      preApproved: "Preaprobado",
      notViable: "No viable",
    },
    dates: {
      created: (date: string) => `Creado: ${date}`,
      updated: (date: string) => `Última actualización: ${date}`,
    },
  },
  timeline: {
    loading: "Cargando historial de eventos...",
    error: "No se pudo cargar el historial",
    empty: "Aún no hay eventos registrados.",
    ariaLabel: "Historial de eventos de la solicitud",
    events: {
      CREATED: "Solicitud creada",
      UPDATED: "Información actualizada",
      DRAFT_SAVED: "Borrador guardado",
      SIMULATION_REQUESTED: "Simulación solicitada",
      SIMULATION_SUCCESS: "Simulación: oferta viable",
      SIMULATION_NOT_VIABLE: "Simulación: no viable",
      SIMULATION_ERROR: "Simulación: error técnico",
      FINALIZED: "Solicitud finalizada",
      ABANDONED: "Solicitud abandonada",
    },
  },
  header: {
    logo: "CD",
    brand: "Crédito Digital",
    nav: {
      applications: "Mis solicitudes",
      apply: "Solicitar ahora",
    },
  },
  footer: {
    copyright: (year: number) => `© ${year} Crédito Digital. Todos los derechos reservados.`,
    disclaimer: "Este es un producto financiero regulado. Aplican términos y condiciones.",
  },
};
