import { IPromptCreateDto } from '@/llm-context/prompt/domain/dtos/entities/prompt-create/prompt-create.dto';

/**
 * Data Transfer Object for updating a prompt.
 *
 * Allows partial updating of a prompt entity, excluding the prompt's immutable identifier (`id`).
 * @type IPromptUpdateDto
 * @extends Partial<Omit<IPromptCreateDto, 'id'>>
 */
export type IPromptUpdateDto = Partial<Omit<IPromptCreateDto, 'id'>>;
