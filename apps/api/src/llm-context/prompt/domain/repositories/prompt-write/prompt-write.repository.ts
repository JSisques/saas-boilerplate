import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';

export const PROMPT_WRITE_REPOSITORY_TOKEN = Symbol('PromptWriteRepository');

export interface PromptWriteRepository {
  findById(id: string): Promise<PromptAggregate | null>;
  save(prompt: PromptAggregate): Promise<PromptAggregate>;
  delete(id: string): Promise<boolean>;
}
