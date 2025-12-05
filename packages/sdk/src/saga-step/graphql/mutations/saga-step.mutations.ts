export const SAGA_STEP_CREATE_MUTATION = `
  mutation SagaStepCreate($input: SagaStepCreateRequestDto!) {
    sagaStepCreate(input: $input) {
      success
      message
      id
    }
  }
`;

export const SAGA_STEP_UPDATE_MUTATION = `
  mutation SagaStepUpdate($input: SagaStepUpdateRequestDto!) {
    sagaStepUpdate(input: $input) {
      success
      message
      id
    }
  }
`;

export const SAGA_STEP_CHANGE_STATUS_MUTATION = `
  mutation SagaStepChangeStatus($input: SagaStepChangeStatusRequestDto!) {
    sagaStepChangeStatus(input: $input) {
      success
      message
      id
    }
  }
`;

export const SAGA_STEP_DELETE_MUTATION = `
  mutation SagaStepDelete($input: SagaStepDeleteRequestDto!) {
    sagaStepDelete(input: $input) {
      success
      message
      id
    }
  }
`;
