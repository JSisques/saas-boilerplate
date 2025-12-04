/**
 * Data Transfer Object for updating a saga log via command layer.
 *
 * @interface ISagaLogUpdateCommandDto
 * @property {string} id - The id of the saga log. Must be provided.
 * @property {string} type - The type of the saga log. Optional.
 * @property {string} message - The message of the saga log. Optional.
 */
export interface ISagaLogUpdateCommandDto {
  id: string;
  type?: string;
  message?: string;
}
