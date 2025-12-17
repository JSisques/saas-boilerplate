import { FeatureStatusEnum } from '@/prisma/master/client';
import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';

export type FeaturePrismaDto = BasePrismaDto & {
  id: string;
  key: string;
  name: string;
  description: string | null;
  status: FeatureStatusEnum;
};
