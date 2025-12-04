/**
 * Data Transfer Object for deleting a saga log via command layer.
 *
 * @interface ISagaLogDeleteCommandDto
 * @property {string} id - The id of the saga log. Must be provided.
 */
export interface ISagaLogDeleteCommandDto {
  id: string;
}
