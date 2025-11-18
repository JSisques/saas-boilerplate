import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { PromptWriteRepository } from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { PromptPrismaMapper } from '@/llm-context/prompt/infrastructure/database/prisma/mappers/prompt-prisma.mapper';
import { BasePrismaRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/services/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromptPrismaRepository
  extends BasePrismaRepository
  implements PromptWriteRepository
{
  constructor(
    prisma: PrismaService,
    private readonly promptPrismaMapper: PromptPrismaMapper,
  ) {
    super(prisma);
    this.logger = new Logger(PromptPrismaRepository.name);
  }

  /**
   * Finds a prompt by their id
   *
   * @param id - The id of the prompt to find
   * @returns The prompt if found, null otherwise
   */
  async findById(id: string): Promise<PromptAggregate | null> {
    const promptData = await this.prismaService.prompt.findUnique({
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

    const result = await this.prismaService.prompt.upsert({
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

    await this.prismaService.prompt.delete({
      where: { id },
    });

    return true;
  }
}
