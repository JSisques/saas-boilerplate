export const SAGA_STEP_FIND_BY_ID_QUERY = `
  query SagaStepFindById($input: SagaStepFindByIdRequestDto!) {
    sagaStepFindById(input: $input) {
      id
      sagaInstanceId
      name
      order
      status
      startDate
      endDate
      errorMessage
      retryCount
      maxRetries
      payload
      result
      createdAt
      updatedAt
    }
  }
`;

export const SAGA_STEP_FIND_BY_SAGA_INSTANCE_ID_QUERY = `
  query SagaStepFindBySagaInstanceId($input: SagaStepFindBySagaInstanceIdRequestDto!) {
    sagaStepFindBySagaInstanceId(input: $input) {
      id
      sagaInstanceId
      name
      order
      status
      startDate
      endDate
      errorMessage
      retryCount
      maxRetries
      payload
      result
      createdAt
      updatedAt
    }
  }
`;

export const SAGA_STEP_FIND_BY_CRITERIA_QUERY = `
  query SagaStepFindByCriteria($input: SagaStepFindByCriteriaRequestDto) {
    sagaStepFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        sagaInstanceId
        name
        order
        status
        startDate
        endDate
        errorMessage
        retryCount
        maxRetries
        payload
        result
        createdAt
        updatedAt
      }
    }
  }
`;
