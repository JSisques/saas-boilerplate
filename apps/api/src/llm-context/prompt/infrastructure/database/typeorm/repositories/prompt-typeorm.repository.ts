import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { PromptWriteRepository } from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { PromptTypeormEntity } from '@/llm-context/prompt/infrastructure/database/typeorm/entities/prompt-typeorm.entity';
import { PromptTypeormMapper } from '@/llm-context/prompt/infrastructure/database/typeorm/mappers/prompt-typeorm.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromptTypeormRepository
  extends BaseTypeormMasterRepository<PromptTypeormEntity>
  implements PromptWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly promptTypeormMapper: PromptTypeormMapper,
  ) {
    super(typeormMasterService, PromptTypeormEntity);
    this.logger = new Logger(PromptTypeormRepository.name);
  }

  /**
   * Finds a prompt by their id
   *
   * @param id - The id of the prompt to find
   * @returns The prompt if found, null otherwise
   */
  async findById(id: string): Promise<PromptAggregate | null> {
    this.logger.log(`Finding prompt by id: ${id}`);
    const promptEntity = await this.repository.findOne({
      where: { id },
    });

    return promptEntity
      ? this.promptTypeormMapper.toDomainEntity(promptEntity)
      : null;
  }

  /**
   * Saves a prompt
   *
   * @param prompt - The prompt to save
   * @returns The saved prompt
   */
  async save(prompt: PromptAggregate): Promise<PromptAggregate> {
    this.logger.log(`Saving prompt: ${prompt.id.value}`);
    const promptEntity = this.promptTypeormMapper.toTypeormEntity(prompt);

    const savedEntity = await this.repository.save(promptEntity);

    return this.promptTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a prompt (soft delete)
   *
   * @param id - The id of the prompt to delete
   * @returns True if the prompt was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting prompt by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
