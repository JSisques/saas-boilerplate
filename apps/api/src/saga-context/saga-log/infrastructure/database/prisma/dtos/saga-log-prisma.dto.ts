import { SagaLogTypeEnum } from '@/prisma/master/client';
import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';

export type SagaLogPrismaDto = BasePrismaDto & {
  id: string;
  sagaInstanceId: string;
  sagaStepId: string;
  type: SagaLogTypeEnum;
  message: string;
};
