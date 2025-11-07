/**
 * Data Transfer Object for drafting a new prompt via command layer.
 *
 * @interface IPromptDraftCommandDto
 * @property {string} id - The id of the prompt. Must be provided.
 */

export interface IPromptDraftCommandDto {
  id: string;
}
