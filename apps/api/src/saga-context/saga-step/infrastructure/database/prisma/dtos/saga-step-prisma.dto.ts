import { SagaStepStatusEnum } from '@/prisma/master/client';
import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';

export type SagaStepPrismaDto = BasePrismaDto & {
  id: string;
  sagaInstanceId: string;
  name: string;
  order: number;
  status: SagaStepStatusEnum;
  startDate: Date | null;
  endDate: Date | null;
  errorMessage: string | null;
  retryCount: number;
  maxRetries: number;
  payload: any;
  result: any;
};
