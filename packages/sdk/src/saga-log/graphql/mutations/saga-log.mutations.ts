export const SAGA_LOG_CREATE_MUTATION = `
  mutation SagaLogCreate($input: SagaLogCreateRequestDto!) {
    sagaLogCreate(input: $input) {
      success
      message
      id
    }
  }
`;

export const SAGA_LOG_UPDATE_MUTATION = `
  mutation SagaLogUpdate($input: SagaLogUpdateRequestDto!) {
    sagaLogUpdate(input: $input) {
      success
      message
      id
    }
  }
`;

export const SAGA_LOG_DELETE_MUTATION = `
  mutation SagaLogDelete($input: SagaLogDeleteRequestDto!) {
    sagaLogDelete(input: $input) {
      success
      message
      id
    }
  }
`;
