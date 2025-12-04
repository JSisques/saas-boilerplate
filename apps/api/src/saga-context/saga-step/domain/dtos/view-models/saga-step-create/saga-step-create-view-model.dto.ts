/**
 * Saga step creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when a saga step is created, tailored for presentation layers.
 *
 * @interface ISagaStepCreateViewModelDto
 * @property {string} id - The unique, immutable identifier of the saga step.
 * @property {string} sagaInstanceId - The unique identifier of the saga instance.
 * @property {string} name - The name of the saga step.
 * @property {number} order - The order of the saga step.
 * @property {string} status - The status of the saga step.
 * @property {Date | null} startDate - The start date of the saga step.
 * @property {Date | null} endDate - The end date of the saga step.
 * @property {string | null} errorMessage - The error message of the saga step.
 * @property {number} retryCount - The retry count of the saga step.
 * @property {number} maxRetries - The maximum retries of the saga step.
 * @property {any} payload - The payload of the saga step.
 * @property {any} result - The result of the saga step.
 * @property {Date} createdAt - Timestamp when the saga step was created.
 * @property {Date} updatedAt - Timestamp when the saga step was last updated.
 */
export interface ISagaStepCreateViewModelDto {
  id: string;
  sagaInstanceId: string;
  name: string;
  order: number;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  errorMessage: string | null;
  retryCount: number;
  maxRetries: number;
  payload: any;
  result: any;
  createdAt: Date;
  updatedAt: Date;
}
