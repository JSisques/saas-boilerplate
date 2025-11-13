/**
 * Data Transfer Object for deprecating a prompt by id via command layer.
 *
 * @interface IPromptDeprecateCommandDto
 * @property {string} id - The id of the prompt to deprecate.
 */
export interface IPromptDeprecateCommandDto {
  id: string;
}
