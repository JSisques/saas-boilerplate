/**
 * Data Transfer Object for creating a new feature via command layer.
 *
 * @interface IFeatureCreateCommandDto
 * @property {string} key - The unique key of the feature (e.g., "advanced-analytics").
 * @property {string} name - The name of the feature.
 * @property {string | null} description - The description of the feature. Can be null if not provided.
 * @property {string} status - The status of the feature. Defaults to ACTIVE if not provided.
 */
export interface IFeatureCreateCommandDto {
  key: string;
  name: string;
  description?: string | null;
  status?: string;
}
