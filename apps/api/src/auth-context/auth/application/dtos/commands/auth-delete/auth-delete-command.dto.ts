/**
 * Data Transfer Object for deleting an auth via command layer.
 *
 * @interface IAuthDeleteCommandDto
 * @property {string} id - The id of the auth to delete.
 */
export interface IAuthDeleteCommandDto {
  id: string;
}
