export const TENANT_FIND_BY_CRITERIA_QUERY = `
      query TenantFindByCriteria($input: TenantFindByCriteriaRequestDto) {
        tenantFindByCriteria(input: $input) {
          total
          page
          perPage
          totalPages
          items {
            id
            name
            slug
            description
            websiteUrl
            logoUrl
            faviconUrl
            primaryColor
            secondaryColor
            status
            email
            phoneNumber
            phoneCode
            address
            city
            state
            country
            postalCode
            timezone
            locale
            maxUsers
            maxStorage
            maxApiCalls
            createdAt
            updatedAt
          }
        }
      }
    `;
export const TENANT_FIND_BY_ID_QUERY = `
      query TenantFindById($input: TenantFindByIdRequestDto!) {
        tenantFindById(input: $input) {
            id
            name
            slug
            description
            websiteUrl
            logoUrl
            faviconUrl
            primaryColor
            secondaryColor
            status
            email
            phoneNumber
            phoneCode
            address
            city
            state
            country
            postalCode
            timezone
            locale
            maxUsers
            maxStorage
            maxApiCalls
            createdAt
            updatedAt
        }
      }
    `;
