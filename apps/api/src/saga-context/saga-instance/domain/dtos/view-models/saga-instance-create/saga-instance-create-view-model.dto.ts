/**
 * Saga instance creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when a saga instance is created, tailored for presentation layers.
 *
 * @interface ISagaInstanceCreateViewModelDto
 * @property {string} id - The unique, immutable identifier of the saga instance.
 * @property {string} name - The name of the saga instance.
 * @property {string} status - The status of the saga instance.
 * @property {Date | null} startDate - The start date of the saga instance.
 * @property {Date | null} endDate - The end date of the saga instance.
 * @property {Date} createdAt - Timestamp when the saga instance was created.
 * @property {Date} updatedAt - Timestamp when the saga instance was last updated.
 */
export interface ISagaInstanceCreateViewModelDto {
  id: string;
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
