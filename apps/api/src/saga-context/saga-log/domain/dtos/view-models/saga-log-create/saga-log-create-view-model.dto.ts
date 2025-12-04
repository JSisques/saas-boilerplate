/**
 * Saga log creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when a saga log is created, tailored for presentation layers.
 *
 * @interface ISagaLogCreateViewModelDto
 * @property {string} id - The unique, immutable identifier of the saga log.
 * @property {string} sagaInstanceId - The unique identifier of the saga instance.
 * @property {string} sagaStepId - The unique identifier of the saga step.
 * @property {string} type - The type of the saga log.
 * @property {string} message - The message of the saga log.
 * @property {Date} createdAt - Timestamp when the saga log was created.
 * @property {Date} updatedAt - Timestamp when the saga log was last updated.
 */
export interface ISagaLogCreateViewModelDto {
  id: string;
  sagaInstanceId: string;
  sagaStepId: string;
  type: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
