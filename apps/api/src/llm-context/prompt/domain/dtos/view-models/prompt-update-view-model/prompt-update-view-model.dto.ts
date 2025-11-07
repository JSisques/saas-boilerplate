import { IPromptCreateViewModelDto } from '@/llm-context/prompt/domain/dtos/view-models/prompt-create-view-model/prompt-create-view-model.dto';

/**
 * Data Transfer Object for updating a prompt.
 *
 * Allows partial updating of a prompt entity, excluding the prompt's immutable identifier (`id`).
 * @type IPromptUpdateViewModelDto
 * @extends Partial<Omit<IPromptCreateViewModelDto, 'id'>>
 */
export type IPromptUpdateViewModelDto = Partial<
  Omit<IPromptCreateViewModelDto, 'id' | 'createdAt' | 'updatedAt'>
>;
