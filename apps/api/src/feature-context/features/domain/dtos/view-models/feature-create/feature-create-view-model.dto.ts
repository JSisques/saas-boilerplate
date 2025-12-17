/**
 * Feature creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when a feature is created, tailored for presentation layers.
 *
 * @interface IFeatureCreateViewModelDto
 * @property {string} id - The unique, immutable identifier of the feature.
 * @property {string} key - The unique key of the feature (e.g., "advanced-analytics").
 * @property {string} name - The name of the feature.
 * @property {string | null} description - The description of the feature (nullable).
 * @property {string} status - The status of the feature.
 * @property {Date} createdAt - Timestamp when the feature was created.
 * @property {Date} updatedAt - Timestamp when the feature was last updated.
 */
export interface IFeatureCreateViewModelDto {
  id: string;
  key: string;
  name: string;
  description: string | null;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
