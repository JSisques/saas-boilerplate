import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { IFeatureWriteRepository } from '@/feature-context/features/domain/repositories/feature-write.repository';
import { FeatureTypeormEntity } from '@/feature-context/features/infrastructure/database/typeorm/entities/feature-typeorm.entity';
import { FeatureTypeormMapper } from '@/feature-context/features/infrastructure/database/typeorm/mappers/feature-typeorm.mapper';
import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FeatureTypeormRepository
  extends BaseTypeormMasterRepository<FeatureTypeormEntity>
  implements IFeatureWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly featureTypeormMapper: FeatureTypeormMapper,
  ) {
    super(typeormMasterService, FeatureTypeormEntity);
    this.logger = new Logger(FeatureTypeormRepository.name);
  }

  /**
   * Finds a feature by their id
   *
   * @param id - The id of the feature to find
   * @returns The feature if found, null otherwise
   */
  async findById(id: string): Promise<FeatureAggregate | null> {
    this.logger.log(`Finding feature by id: ${id}`);
    const featureEntity = await this.repository.findOne({
      where: { id },
    });

    return featureEntity
      ? this.featureTypeormMapper.toDomainEntity(featureEntity)
      : null;
  }

  /**
   * Saves a feature
   *
   * @param feature - The feature to save
   * @returns The saved feature
   */
  async save(feature: FeatureAggregate): Promise<FeatureAggregate> {
    this.logger.log(`Saving feature: ${feature.id.value}`);
    const featureEntity = this.featureTypeormMapper.toTypeormEntity(feature);

    const savedEntity = await this.repository.save(featureEntity);

    return this.featureTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a feature (soft delete)
   *
   * @param id - The id of the feature to delete
   * @returns Promise that resolves when the feature is deleted
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Soft deleting feature by id: ${id}`);

    await this.repository.softDelete(id);
  }
}
