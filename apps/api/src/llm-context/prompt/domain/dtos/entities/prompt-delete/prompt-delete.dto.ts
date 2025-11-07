import { IPromptCreateDto } from '@/llm-context/prompt/domain/dtos/entities/prompt-create/prompt-create.dto';

/**
 * Data Transfer Object for deleting a prompt.
 *
 * Allows deleting a prompt entity by specifying only the prompt's immutable identifier (`id`).
 * @type IPromptDeleteDto
 * @property {PromptUuidValueObject} id - The immutable identifier of the prompt to delete.
 */
export type IPromptDeleteDto = Pick<IPromptCreateDto, 'id'>;
