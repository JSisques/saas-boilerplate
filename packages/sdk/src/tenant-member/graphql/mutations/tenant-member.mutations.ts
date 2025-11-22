export const TENANT_MEMBER_ADD_MUTATION = `
      mutation TenantMemberAdd($input: TenantMemberAddRequestDto!) {
        tenantMemberAdd(input: $input) {
          success
          message
          id
        }
      }
    `;

export const TENANT_MEMBER_UPDATE_MUTATION = `
      mutation TenantMemberUpdate($input: TenantMemberUpdateRequestDto!) {
        tenantMemberUpdate(input: $input) {
          success
          message
          id
        }
      }
    `;

export const TENANT_MEMBER_REMOVE_MUTATION = `
      mutation TenantMemberRemove($input: TenantMemberRemoveRequestDto!) {
        tenantMemberRemove(input: $input) {
          success
          message
          id
        }
      }
    `;
