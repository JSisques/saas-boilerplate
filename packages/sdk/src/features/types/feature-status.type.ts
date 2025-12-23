export type FeatureStatus = 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';

/**
 * Array of all possible feature status values.
 * Useful for dropdowns, filters, and validation.
 */
export const FEATURE_STATUSES: FeatureStatus[] = [
  'ACTIVE',
  'INACTIVE',
  'DEPRECATED',
];
