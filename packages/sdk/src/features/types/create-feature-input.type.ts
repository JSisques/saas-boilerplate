import { FeatureStatus } from './feature-status.type.js';

export type CreateFeatureInput = {
  key: string;
  name: string;
  description?: string | null;
  status?: FeatureStatus;
};
