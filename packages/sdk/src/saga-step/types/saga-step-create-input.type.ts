export type SagaStepCreateInput = {
  sagaInstanceId: string;
  name: string;
  order: number;
  payload: string; // JSON string
};
