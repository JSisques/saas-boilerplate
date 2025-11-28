import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type StoragePrimitives = BasePrimitives & {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  provider: string;
  url: string;
  path: string;
};
