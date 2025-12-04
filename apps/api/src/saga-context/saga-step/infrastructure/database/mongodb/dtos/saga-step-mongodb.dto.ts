export type SagaStepMongoDbDto = {
  id: string;
  sagaInstanceId: string;
  name: string;
  order: number;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  errorMessage: string | null;
  retryCount: number;
  maxRetries: number;
  payload: any;
  result: any;
  createdAt: Date;
  updatedAt: Date;
};
