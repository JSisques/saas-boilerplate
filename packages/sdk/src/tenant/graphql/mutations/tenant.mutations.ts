export const TENANT_CREATE_MUTATION = `
      mutation TenantCreate($input: TenantCreateRequestDto!) {
        tenantCreate(input: $input) {
          success
          message
          id
        }
      }
    `;

export const TENANT_UPDATE_MUTATION = `
      mutation TenantUpdate($input: TenantUpdateRequestDto!) {
        tenantUpdate(input: $input) {
          success
          message
          id
        }
      }
    `;

export const TENANT_DELETE_MUTATION = `
      mutation TenantDelete($input: TenantDeleteRequestDto!) {
        tenantDelete(input: $input) {
          success
          message
          id
        }
      }
    `;
