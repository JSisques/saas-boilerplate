/**
 * Data Transfer Object for updating a feature via command layer.
 *
 * @interface IFeatureUpdateCommandDto
 * @property {string} id - The id of the feature to update.
 * @property {string} [key] - The key of the feature.
 * @property {string} [name] - The name of the feature.
 * @property {string | null} [description] - The description of the feature.
 * @property {string} [status] - The status of the feature.
 */
export interface IFeatureUpdateCommandDto {
  id: string;
  key?: string;
  name?: string;
  description?: string | null;
  status?: string;
}
