import { PromptReadRepository } from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { PromptMongoDBMapper } from '@/llm-context/prompt/infrastructure/database/mongodb/mappers/prompt-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoRepository } from '@/shared/infrastructure/database/mongodb/base-mongo.repository';
import { MongoService } from '@/shared/infrastructure/database/mongodb/mongo.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromptMongoRepository
  extends BaseMongoRepository
  implements PromptReadRepository
{
  private readonly collectionName = 'prompts';

  constructor(
    mongoService: MongoService,
    private readonly promptMongoDBMapper: PromptMongoDBMapper,
  ) {
    super(mongoService);
    this.logger = new Logger(PromptMongoRepository.name);
  }

  /**
   * Finds a prompt by id
   *
   * @param id - The id of the prompt to find
   * @returns The prompt if found, null otherwise
   */
  async findById(id: string): Promise<PromptViewModel | null> {
    this.logger.log(`Finding prompt by id: ${id}`);

    const collection = this.mongoService.getCollection(this.collectionName);
    const promptViewModel = await collection.findOne({ id });

    return promptViewModel
      ? this.promptMongoDBMapper.toViewModel({
          id: promptViewModel.id,
          title: promptViewModel.title,
          slug: promptViewModel.slug,
          version: promptViewModel.version,
          description: promptViewModel.description,
          content: promptViewModel.content,
          status: promptViewModel.status,
          isActive: promptViewModel.isActive,
          createdAt: promptViewModel.createdAt,
          updatedAt: promptViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds prompts by criteria
   *
   * @param criteria - The criteria to find prompts by
   * @returns The prompts found
   */

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<PromptViewModel>> {
    this.logger.log(`Finding prompts by criteria: ${JSON.stringify(criteria)}`);

    const collection = this.mongoService.getCollection(this.collectionName);

    // 01: Build MongoDB query from criteria
    const mongoQuery = this.buildMongoQuery(criteria);
    const sortQuery = this.buildSortQuery(criteria);

    // 02: Calculate pagination
    const page = criteria.pagination.page || 1;
    const limit = criteria.pagination.perPage || 10;
    const skip = (page - 1) * limit;

    // 03: Execute query with pagination
    const [data, total] = await Promise.all([
      collection
        .find(mongoQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(mongoQuery),
    ]);

    // 04: Convert MongoDB documents to domain entities
    const prompts = data.map((doc) =>
      this.promptMongoDBMapper.toViewModel({
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        version: doc.version,
        description: doc.description,
        content: doc.content,
        status: doc.status,
        isActive: doc.isActive,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<PromptViewModel>(prompts, total, page, limit);
  }

  /**
   * Saves a prompt view model (upsert operation)
   *
   * @param promptViewModel - The prompt view model to save
   */
  async save(promptViewModel: PromptViewModel): Promise<void> {
    this.logger.log(`Saving prompt view model with id: ${promptViewModel.id}`);

    const collection = this.mongoService.getCollection(this.collectionName);
    const mongoData = this.promptMongoDBMapper.toMongoData(promptViewModel);

    // 01: Use upsert to either insert or update the prompt view model
    await collection.replaceOne({ id: promptViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a prompt view model by id
   *
   * @param id - The id of the prompt view model to delete
   * @returns True if the prompt was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting prompt view model by id: ${id}`);

    const collection = this.mongoService.getCollection(this.collectionName);

    // 01: Delete the prompt view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
