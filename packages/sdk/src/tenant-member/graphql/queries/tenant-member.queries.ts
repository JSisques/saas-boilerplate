export const TENANT_MEMBER_FIND_BY_CRITERIA_QUERY = `
      query TenantMemberFindByCriteria($input: TenantMemberFindByCriteriaRequestDto) {
        tenantMemberFindByCriteria(input: $input) {
          total
          page
          perPage
          totalPages
          items {
            id
            tenantId
            userId
            role
            createdAt
            updatedAt
          }
        }
      }
    `;
export const TENANT_MEMBER_FIND_BY_ID_QUERY = `
      query TenantMemberFindById($input: TenantMemberFindByIdRequestDto!) {
        tenantMemberFindById(input: $input) {
          id
          tenantId
          userId
          role
          createdAt
          updatedAt
        }
      }
    `;
