/**
 * Data Transfer Object for creating a new prompt via command layer.
 *
 * @interface IPromptCreateCommandDto
 * @property {string} id - The id of the prompt. Must be provided.
 * @property {string} slug - The slug of the prompt. Must be provided.
 * @property {number} version - The version of the prompt. Must be provided.
 * @property {string} title - The title of the prompt. Must be provided.
 * @property {string | null} description - The description of the prompt. Can be null if not provided.
 * @property {string} content - The content of the prompt. Must be provided.
 * @property {string} status - The status of the prompt. Must be provided.
 * @property {boolean} isActive - The is active of the prompt. Must be provided.
 */
export interface IPromptCreateCommandDto {
  title: string;
  description: string | null;
  content: string;
  status: string;
}
