import { FeatureStatus } from './feature-status.type.js';

export type FeatureChangeStatusInput = {
  id: string;
  status: FeatureStatus;
};
