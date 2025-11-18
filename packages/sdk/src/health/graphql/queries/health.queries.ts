export const HEALTH_CHECK_QUERY = `
      query HealthCheck {
        healthCheck {
          status
          writeDatabaseStatus
          readDatabaseStatus
        }
      }
    `;
