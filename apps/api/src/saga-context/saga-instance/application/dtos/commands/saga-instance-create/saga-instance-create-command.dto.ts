/**
 * Data Transfer Object for creating a saga instance via command layer.
 *
 * @interface ISagaInstanceCreateCommandDto
 * @property {string} name - The name of the saga instance. Must be provided.
 * @property {string} status - The status of the saga instance. Must be provided.
 * @property {string} startDate - The start date of the saga instance. Must be provided.
 */
export interface ISagaInstanceCreateCommandDto {
  name: string;
}
