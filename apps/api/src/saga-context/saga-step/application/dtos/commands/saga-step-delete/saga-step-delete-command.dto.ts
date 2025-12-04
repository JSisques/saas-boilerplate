/**
 * Data Transfer Object for deleting a saga step via command layer.
 *
 * @interface ISagaStepDeleteCommandDto
 * @property {string} id - The id of the saga step to delete.
 */
export interface ISagaStepDeleteCommandDto {
  id: string;
}
