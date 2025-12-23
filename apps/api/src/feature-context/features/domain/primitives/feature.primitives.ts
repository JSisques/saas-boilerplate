import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type FeaturePrimitives = BasePrimitives & {
  id: string;
  key: string;
  name: string;
  description: string | null;
  status: string;
};
