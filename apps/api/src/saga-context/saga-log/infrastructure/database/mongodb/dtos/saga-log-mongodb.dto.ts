export type SagaLogMongoDbDto = {
  id: string;
  sagaInstanceId: string;
  sagaStepId: string;
  type: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};
