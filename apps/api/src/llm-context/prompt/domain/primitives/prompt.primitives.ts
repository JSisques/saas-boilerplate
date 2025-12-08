import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type PromptPrimitives = BasePrimitives & {
  id: string;
  slug: string;
  version: number;
  title: string;
  description: string | null;
  content: string;
  status: string;
  isActive: boolean;
};
