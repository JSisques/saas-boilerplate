import { SagaStatusEnum } from '@/prisma/master/client';
import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';

export type SagaInstancePrismaDto = BasePrismaDto & {
  id: string;
  name: string;
  status: SagaStatusEnum;
  startDate: Date | null;
  endDate: Date | null;
};
