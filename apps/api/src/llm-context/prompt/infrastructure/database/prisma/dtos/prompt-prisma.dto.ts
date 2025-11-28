import { PromptStatusEnum } from '@/prisma/master/client';

export type PromptPrismaDto = {
  id: string;
  slug: string;
  version: number;
  title: string;
  description: string | null;
  content: string;
  status: PromptStatusEnum;
  isActive: boolean;
};
