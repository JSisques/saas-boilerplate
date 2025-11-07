import { IPromptCreateCommandDto } from '@/llm-context/prompt/application/dtos/commands/prompt-create/prompt-create-command.dto';

/**
 * Data Transfer Object for updating a prompt by id via command layer.
 *
 * @interface IPromptUpdateCommandDto
 * @property {string} id - The id of the prompt to update.
 * @extends Partial<IPromptCreateCommandDto>
 */
export interface IPromptUpdateCommandDto
  extends Partial<IPromptCreateCommandDto> {
  id: string;
}
