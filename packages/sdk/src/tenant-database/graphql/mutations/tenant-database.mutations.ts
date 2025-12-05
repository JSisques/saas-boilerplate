export const TENANT_DATABASE_CREATE_MUTATION = `
  mutation TenantDatabaseCreate($input: TenantDatabaseCreateRequestDto!) {
    tenantDatabaseCreate(input: $input) {
      success
      message
      id
    }
  }
`;

export const TENANT_DATABASE_UPDATE_MUTATION = `
  mutation TenantDatabaseUpdate($input: TenantDatabaseUpdateRequestDto!) {
    tenantDatabaseUpdate(input: $input) {
      success
      message
      id
    }
  }
`;

export const TENANT_DATABASE_DELETE_MUTATION = `
  mutation TenantDatabaseDelete($input: TenantDatabaseDeleteRequestDto!) {
    tenantDatabaseDelete(input: $input) {
      success
      message
      id
    }
  }
`;
