/**
 * Data Transfer Object for activating a prompt by id via command layer.
 *
 * @interface IPromptActivateCommandDto
 * @property {string} id - The id of the prompt to activate.
 */
export interface IPromptActivateCommandDto {
  id: string;
}
