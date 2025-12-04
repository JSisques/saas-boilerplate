/**
 * Data Transfer Object for creating a saga log via command layer.
 *
 * @interface ISagaLogCreateCommandDto
 * @property {string} sagaInstanceId - The id of the saga instance. Must be provided.
 * @property {string} sagaStepId - The id of the saga step. Must be provided.
 * @property {string} type - The type of the saga log. Must be provided.
 * @property {string} message - The message of the saga log. Must be provided.
 */
export interface ISagaLogCreateCommandDto {
  sagaInstanceId: string;
  sagaStepId: string;
  type: string;
  message: string;
}
