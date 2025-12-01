/**
 * Data Transfer Object for deleting a saga instance via command layer.
 *
 * @interface ISagaInstanceDeleteCommandDto
 * @property {string} id - The id of the saga instance to delete.
 */
export interface ISagaInstanceDeleteCommandDto {
  id: string;
}
