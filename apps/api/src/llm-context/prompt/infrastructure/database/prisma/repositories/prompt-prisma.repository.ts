import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { PromptWriteRepository } from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { PromptPrismaMapper } from '@/llm-context/prompt/infrastructure/database/prisma/mappers/prompt-prisma.mapper';
import { BasePrismaMasterRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-master/base-prisma-master.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromptPrismaRepository
  extends BasePrismaMasterRepository
  implements PromptWriteRepository
{
  constructor(
    prismaMasterService: PrismaMasterService,
    private readonly promptPrismaMapper: PromptPrismaMapper,
  ) {
    super(prismaMasterService);
    this.logger = new Logger(PromptPrismaRepository.name);
  }

  /**
   * Finds a prompt by their id
   *
   * @param id - The id of the prompt to find
   * @returns The prompt if found, null otherwise
   */
  async findById(id: string): Promise<PromptAggregate | null> {
    const promptData = await this.prismaMasterService.client.prompt.findUnique({
      where: { id },
    });

    if (!promptData) {
      return null;
    }

    return this.promptPrismaMapper.toDomainEntity({
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
   * Saves a prompt
   *
   * @param prompt - The prompt to save
   * @returns The saved prompt
   */
  async save(prompt: PromptAggregate): Promise<PromptAggregate> {
    const promptData = this.promptPrismaMapper.toPrismaData(prompt);

    const result = await this.prismaMasterService.client.prompt.upsert({
      where: { id: prompt.id.value },
      update: promptData,
      create: promptData,
    });

    return this.promptPrismaMapper.toDomainEntity({
      id: result.id,
      slug: result.slug,
      version: result.version,
      title: result.title,
      description: result.description,
      content: result.content,
      status: result.status,
      isActive: result.isActive,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  /**
   * Deletes a prompt
   *
   * @param prompt - The prompt to delete
   * @returns True if the prompt was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting prompt by id: ${id}`);

    await this.prismaMasterService.client.prompt.delete({
      where: { id },
    });

    return true;
  }
}
