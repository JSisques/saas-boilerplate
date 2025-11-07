import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

export const PROMPT_READ_REPOSITORY_TOKEN = Symbol('PromptReadRepository');

export interface PromptReadRepository {
  findById(id: string): Promise<PromptViewModel | null>;
  findByCriteria(criteria: Criteria): Promise<PaginatedResult<PromptViewModel>>;
  save(promptViewModel: PromptViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
