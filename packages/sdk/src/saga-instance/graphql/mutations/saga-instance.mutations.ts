export const SAGA_INSTANCE_CREATE_MUTATION = `
  mutation SagaInstanceCreate($input: SagaInstanceCreateRequestDto!) {
    sagaInstanceCreate(input: $input) {
      success
      message
      id
    }
  }
`;

export const SAGA_INSTANCE_UPDATE_MUTATION = `
  mutation SagaInstanceUpdate($input: SagaInstanceUpdateRequestDto!) {
    sagaInstanceUpdate(input: $input) {
      success
      message
      id
    }
  }
`;

export const SAGA_INSTANCE_CHANGE_STATUS_MUTATION = `
  mutation SagaInstanceChangeStatus($input: SagaInstanceChangeStatusRequestDto!) {
    sagaInstanceChangeStatus(input: $input) {
      success
      message
      id
    }
  }
`;

export const SAGA_INSTANCE_DELETE_MUTATION = `
  mutation SagaInstanceDelete($input: SagaInstanceDeleteRequestDto!) {
    sagaInstanceDelete(input: $input) {
      success
      message
      id
    }
  }
`;
