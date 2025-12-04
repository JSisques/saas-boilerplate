export const SAGA_INSTANCE_FIND_BY_ID_QUERY = `
  query SagaInstanceFindById($input: SagaInstanceFindByIdRequestDto!) {
    sagaInstanceFindById(input: $input) {
      id
      name
      status
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const SAGA_INSTANCE_FIND_BY_CRITERIA_QUERY = `
  query SagaInstanceFindByCriteria($input: SagaInstanceFindByCriteriaRequestDto) {
    sagaInstanceFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        name
        status
        startDate
        endDate
        createdAt
        updatedAt
      }
    }
  }
`;
