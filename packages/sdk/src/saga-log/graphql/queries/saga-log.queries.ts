export const SAGA_LOG_FIND_BY_ID_QUERY = `
  query SagaLogFindById($input: SagaLogFindByIdRequestDto!) {
    sagaLogFindById(input: $input) {
      id
      sagaInstanceId
      sagaStepId
      type
      message
      createdAt
      updatedAt
    }
  }
`;

export const SAGA_LOG_FIND_BY_SAGA_INSTANCE_ID_QUERY = `
  query SagaLogFindBySagaInstanceId($input: SagaLogFindBySagaInstanceIdRequestDto!) {
    sagaLogFindBySagaInstanceId(input: $input) {
      id
      sagaInstanceId
      sagaStepId
      type
      message
      createdAt
      updatedAt
    }
  }
`;

export const SAGA_LOG_FIND_BY_SAGA_STEP_ID_QUERY = `
  query SagaLogFindBySagaStepId($input: SagaLogFindBySagaStepIdRequestDto!) {
    sagaLogFindBySagaStepId(input: $input) {
      id
      sagaInstanceId
      sagaStepId
      type
      message
      createdAt
      updatedAt
    }
  }
`;

export const SAGA_LOG_FIND_BY_CRITERIA_QUERY = `
  query SagaLogFindByCriteria($input: SagaLogFindByCriteriaRequestDto) {
    sagaLogFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        sagaInstanceId
        sagaStepId
        type
        message
        createdAt
        updatedAt
      }
    }
  }
`;
