/**
 * Data Transfer Object for creating a subscription.
 *
 * @interface IPromptCreateViewModelDto
 * @property {string} id - The immutable identifier of the prompt.
 * @property {string} slug - The slug of the prompt.
 * @property {number} version - The version of the prompt.
 * @property {string} title - The title of the prompt.
 * @property {string | null} description - The description of the prompt.
 * @property {string} content - The content of the prompt.
 * @property {string} status - The status of the prompt.
 * @property {boolean} isActive - The is active of the prompt.
 */
export interface IPromptCreateViewModelDto {
  id: string;
  slug: string;
  version: number;
  title: string;
  description: string | null;
  content: string;
  status: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
