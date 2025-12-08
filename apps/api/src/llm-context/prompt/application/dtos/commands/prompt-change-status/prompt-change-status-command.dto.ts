import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';

/**
 * Data Transfer Object for changing a prompt status via command layer.
 *
 * @interface IPromptChangeStatusCommandDto
 * @property {string} id - The id of the prompt to change status.
 * @property {PromptStatusEnum} status - The new status to set.
 */
export interface IPromptChangeStatusCommandDto {
  id: string;
  status: PromptStatusEnum;
}
