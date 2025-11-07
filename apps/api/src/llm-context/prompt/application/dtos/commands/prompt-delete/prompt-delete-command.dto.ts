/**
 * Data Transfer Object for deleting a prompt by id via command layer.
 *
 * @interface IPromptDeleteCommandDto
 * @property {string} id - The id of the prompt to delete.
 */
export interface IPromptDeleteCommandDto {
  id: string;
}
