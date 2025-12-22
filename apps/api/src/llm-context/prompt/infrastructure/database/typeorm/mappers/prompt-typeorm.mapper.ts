import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { PromptAggregateFactory } from '@/llm-context/prompt/domain/factories/prompt-aggregate/prompt-aggregate.factory';
import { PromptTypeormEntity } from '@/llm-context/prompt/infrastructure/database/typeorm/entities/prompt-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromptTypeormMapper {
  private readonly logger = new Logger(PromptTypeormMapper.name);

  constructor(
    private readonly promptAggregateFactory: PromptAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a prompt aggregate
   *
   * @param promptEntity - The TypeORM entity to convert
   * @returns The prompt aggregate
   */
  toDomainEntity(promptEntity: PromptTypeormEntity): PromptAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${promptEntity.id}`,
    );

    return this.promptAggregateFactory.fromPrimitives({
      id: promptEntity.id,
      slug: promptEntity.slug,
      version: promptEntity.version,
      title: promptEntity.title,
      description: promptEntity.description ?? null,
      content: promptEntity.content,
      status: promptEntity.status,
      isActive: promptEntity.isActive,
      createdAt: promptEntity.createdAt,
      updatedAt: promptEntity.updatedAt,
    });
  }

  /**
   * Converts a prompt aggregate to a TypeORM entity
   *
   * @param prompt - The prompt aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(prompt: PromptAggregate): PromptTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${prompt.id.value} to TypeORM entity`,
    );

    const primitives = prompt.toPrimitives();

    const entity = new PromptTypeormEntity();

    entity.id = primitives.id;
    entity.slug = primitives.slug;
    entity.version = primitives.version;
    entity.title = primitives.title;
    entity.description = primitives.description;
    entity.content = primitives.content;
    entity.status = primitives.status as PromptStatusEnum;
    entity.isActive = primitives.isActive;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
