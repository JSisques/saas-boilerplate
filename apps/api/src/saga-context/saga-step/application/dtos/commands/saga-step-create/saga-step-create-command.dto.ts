/**
 * Data Transfer Object for creating a saga step via command layer.
 *
 * @interface ISagaStepCreateCommandDto
 * @property {string} sagaInstanceId - The id of the saga instance. Must be provided.
 * @property {string} name - The name of the saga step. Must be provided.
 * @property {number} order - The order of the saga step. Must be provided.
 * @property {any} payload - The payload of the saga step. Must be provided.
 */
export interface ISagaStepCreateCommandDto {
  sagaInstanceId: string;
  name: string;
  order: number;
  payload: any;
}
