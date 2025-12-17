import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { IFeatureWriteRepository } from '@/feature-context/features/domain/repositories/feature-write.repository';
import { FeaturePrismaMapper } from '@/feature-context/features/infrastructure/database/prisma/mappers/feature-prisma.mapper';
import { BasePrismaMasterRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-master/base-prisma-master.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FeaturePrismaRepository
  extends BasePrismaMasterRepository
  implements IFeatureWriteRepository
{
  constructor(
    prismaMasterService: PrismaMasterService,
    private readonly featurePrismaMapper: FeaturePrismaMapper,
  ) {
    super(prismaMasterService);
    this.logger = new Logger(FeaturePrismaRepository.name);
  }

  /**
   * Finds a feature by their id
   *
   * @param id - The id of the feature to find
   * @returns The feature if found, null otherwise
   */
  async findById(id: string): Promise<FeatureAggregate | null> {
    const featureData =
      await this.prismaMasterService.client.feature.findUnique({
        where: { id },
      });

    if (!featureData) {
      return null;
    }

    return this.featurePrismaMapper.toDomainEntity(featureData);
  }

  /**
   * Saves a feature
   *
   * @param feature - The feature to save
   * @returns The saved feature
   */
  async save(feature: FeatureAggregate): Promise<FeatureAggregate> {
    const featureData = this.featurePrismaMapper.toPrismaData(feature);

    const result = await this.prismaMasterService.client.feature.upsert({
      where: { id: feature.id.value },
      update: featureData,
      create: featureData,
    });

    return this.featurePrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a feature
   *
   * @param id - The id of the feature to delete
   * @returns Promise that resolves when the feature is deleted
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting feature by id: ${id}`);

    await this.prismaMasterService.client.feature.delete({
      where: { id },
    });
  }
}
