import { PromptViewModelFactory } from '@/llm-context/prompt/domain/factories/prompt-plan-view-model/prompt-view-model.factory';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { PromptMongoDbDto } from '@/llm-context/prompt/infrastructure/database/mongodb/dtos/prompt-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromptMongoDBMapper {
  private readonly logger = new Logger(PromptMongoDBMapper.name);

  constructor(
    private readonly promptViewModelFactory: PromptViewModelFactory,
  ) {}
  /**
   * Converts a MongoDB document to a prompt view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The prompt view model
   */
  public toViewModel(doc: PromptMongoDbDto): PromptViewModel {
    this.logger.log(
      `Converting MongoDB document to prompt view model with id ${doc.id}`,
    );

    return this.promptViewModelFactory.create(doc);
  }

  /**
   * Converts a prompt view model to a MongoDB document
   *
   * @param promptViewModel - The prompt view model to convert
   * @returns The MongoDB document
   */
  public toMongoData(promptViewModel: PromptViewModel): PromptMongoDbDto {
    this.logger.log(
      `Converting prompt view model with id ${promptViewModel.id} to MongoDB document`,
    );

    return {
      id: promptViewModel.id,
      slug: promptViewModel.slug,
      version: promptViewModel.version,
      title: promptViewModel.title,
      description: promptViewModel.description,
      content: promptViewModel.content,
      status: promptViewModel.status,
      isActive: promptViewModel.isActive,
      createdAt: promptViewModel.createdAt,
      updatedAt: promptViewModel.updatedAt,
    };
  }
}
