/**
 * Data Transfer Object for archiving a prompt by id via command layer.
 *
 * @interface IPromptArchiveCommandDto
 * @property {string} id - The id of the prompt to archive.
 */
export interface IPromptArchiveCommandDto {
  id: string;
}
