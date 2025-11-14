/**
 * Data Transfer Object for deleting a user via command layer.
 *
 * @interface IUserDeleteCommandDto
 * @property {string} id - The id of the user to delete.
 */
export interface IUserDeleteCommandDto {
  id: string;
}

