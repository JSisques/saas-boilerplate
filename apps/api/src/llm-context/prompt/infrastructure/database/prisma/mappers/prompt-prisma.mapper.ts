import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { PromptAggregateFactory } from '@/llm-context/prompt/domain/factories/prompt-aggregate/prompt-aggregate.factory';
import { PromptPrismaDto } from '@/llm-context/prompt/infrastructure/database/prisma/dtos/prompt-prisma.dto';
import { PromptStatusEnum } from '@/prisma/master/client';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromptPrismaMapper {
  private readonly logger = new Logger(PromptPrismaMapper.name);

  constructor(
    private readonly promptAggregateFactory: PromptAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a prompt aggregate
   *
   * @param promptData - The Prisma data to convert
   * @returns The prompt aggregate
   */
  public toDomainEntity(promptData: PromptPrismaDto): PromptAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${promptData.id}`,
    );

    return this.promptAggregateFactory.fromPrimitives({
      id: promptData.id,
      slug: promptData.slug,
      version: promptData.version,
      title: promptData.title,
      description: promptData.description,
      content: promptData.content,
      status: promptData.status,
      isActive: promptData.isActive,
      createdAt: promptData.createdAt,
      updatedAt: promptData.updatedAt,
    });
  }

  /**
   * Converts a prompt aggregate to a Prisma data
   *
   * @param prompt - The prompt aggregate to convert
   * @returns The Prisma data
   */
  public toPrismaData(prompt: PromptAggregate): PromptPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${prompt.id.value} to Prisma data`,
    );

    // Get primitives from aggregate
    const primitives = prompt.toPrimitives();

    return {
      id: primitives.id,
      slug: primitives.slug,
      version: primitives.version,
      title: primitives.title,
      description: primitives.description,
      content: primitives.content,
      status: primitives.status as PromptStatusEnum,
      isActive: primitives.isActive,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
