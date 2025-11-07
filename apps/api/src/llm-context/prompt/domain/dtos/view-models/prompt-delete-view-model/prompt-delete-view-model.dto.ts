import { IPromptCreateViewModelDto } from '@/llm-context/prompt/domain/dtos/view-models/prompt-create-view-model/prompt-create-view-model.dto';

/**
 * Data Transfer Object for deleting a prompt.
 *
 * Allows deleting a prompt entity by specifying only the prompt's immutable identifier (`id`).
 * @type IPromptDeleteViewModelDto
 * @property {string} id - The immutable identifier of the prompt to delete.
 */
export type IPromptDeleteViewModelDto = Pick<IPromptCreateViewModelDto, 'id'>;
