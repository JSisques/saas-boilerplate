import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { IPromptCreateViewModelDto } from '@/llm-context/prompt/domain/dtos/view-models/prompt-create-view-model/prompt-create-view-model.dto';
import { PromptPrimitives } from '@/llm-context/prompt/domain/primitives/prompt.primitives';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new prompt view model.
 */
@Injectable()
export class PromptViewModelFactory
  implements
    IReadFactory<
      PromptViewModel,
      IPromptCreateViewModelDto,
      PromptAggregate,
      PromptPrimitives
    >
{
  private readonly logger = new Logger(PromptViewModelFactory.name);

  /**
   * Creates a new prompt view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: IPromptCreateViewModelDto): PromptViewModel {
    this.logger.log(
      `Creating prompt view model from DTO: ${JSON.stringify(data)}`,
    );
    return new PromptViewModel(data);
  }

  /**
   * Creates a new prompt view model from a prompt primitive.
   *
   * @param promptPrimitives - The prompt primitive to create the view model from.
   * @returns The prompt view model.
   */
  fromPrimitives(promptPrimitives: PromptPrimitives): PromptViewModel {
    this.logger.log(
      `Creating prompt view model from primitives: ${promptPrimitives}`,
    );

    const now = new Date();

    return new PromptViewModel({
      id: promptPrimitives.id,
      slug: promptPrimitives.slug,
      version: promptPrimitives.version,
      title: promptPrimitives.title,
      description: promptPrimitives.description,
      content: promptPrimitives.content,
      status: promptPrimitives.status,
      isActive: promptPrimitives.isActive,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Creates a new prompt view model from a prompt aggregate.
   *
   * @param promptAggregate - The prompt aggregate to create the view model from.
   * @returns The prompt view model.
   */
  fromAggregate(promptAggregate: PromptAggregate): PromptViewModel {
    this.logger.log(
      `Creating prompt view model from aggregate: ${promptAggregate}`,
    );

    const now = new Date();

    return new PromptViewModel({
      id: promptAggregate.id.value,
      slug: promptAggregate.slug.value,
      version: promptAggregate.version.value,
      title: promptAggregate.title.value,
      description: promptAggregate.description?.value ?? null,
      content: promptAggregate.content.value,
      status: promptAggregate.status.value,
      isActive: promptAggregate.isActive.value,
      createdAt: now,
      updatedAt: now,
    });
  }
}
