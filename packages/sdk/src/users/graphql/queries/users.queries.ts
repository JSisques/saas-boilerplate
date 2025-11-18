export const USER_FIND_BY_CRITERIA_QUERY = `
  query UsersFindByCriteria($input: UserFindByCriteriaRequestDto) {
    usersFindByCriteria(input: $input) {
          total
          page
          perPage
          totalPages
          items {
            id
        userName
        lastName
        role
        status
        avatarUrl
        bio
        name
            createdAt
            updatedAt
          }
        }
      }
    `;

export const USER_FIND_BY_ID_QUERY = `
  query UserFindById($input: UserFindByIdRequestDto!) {
    userFindById(input: $input) {
          id
      userName
      lastName
      role
      status
      avatarUrl
      bio
      name
          createdAt
          updatedAt
        }
      }
    `;
