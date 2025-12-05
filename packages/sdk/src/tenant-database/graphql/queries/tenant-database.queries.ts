export const TENANT_DATABASE_FIND_BY_ID_QUERY = `
  query TenantDatabaseFindById($input: TenantDatabaseFindByIdRequestDto!) {
    tenantDatabaseFindById(input: $input) {
      id
      tenantId
      databaseName
      readDatabaseName
      status
      schemaVersion
      lastMigrationAt
      errorMessage
      createdAt
      updatedAt
    }
  }
`;

export const TENANT_DATABASE_FIND_BY_CRITERIA_QUERY = `
  query TenantDatabaseFindByCriteria($input: TenantDatabaseFindByCriteriaRequestDto) {
    tenantDatabaseFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        tenantId
        databaseName
        readDatabaseName
        status
        schemaVersion
        lastMigrationAt
        errorMessage
        createdAt
        updatedAt
      }
    }
  }
`;
