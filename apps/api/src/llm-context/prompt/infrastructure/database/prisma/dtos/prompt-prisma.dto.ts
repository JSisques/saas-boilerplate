import { PromptStatusEnum } from '@/prisma/master/client';
import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';

export type PromptPrismaDto = BasePrismaDto & {
  id: string;
  slug: string;
  version: number;
  title: string;
  description: string | null;
  content: string;
  status: PromptStatusEnum;
  isActive: boolean;
};
