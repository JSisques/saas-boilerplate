import { FeatureStatus } from './feature-status.type.js';

export type UpdateFeatureInput = {
  id: string;
  key?: string;
  name?: string;
  description?: string | null;
  status?: FeatureStatus;
};
