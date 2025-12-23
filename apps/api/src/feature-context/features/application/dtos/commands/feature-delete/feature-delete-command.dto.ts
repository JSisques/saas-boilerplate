/**
 * Data Transfer Object for deleting a feature via command layer.
 *
 * @interface IFeatureDeleteCommandDto
 * @property {string} id - The id of the feature to delete.
 */
export interface IFeatureDeleteCommandDto {
  id: string;
}
