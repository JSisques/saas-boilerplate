import { FeatureNotFoundException } from '@/feature-context/features/application/exceptions/feature-not-found/feature-not-found.exception';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import {
  FEATURE_WRITE_REPOSITORY_TOKEN,
  IFeatureWriteRepository,
} from '@/feature-context/features/domain/repositories/feature-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertFeatureExistsService
  implements IBaseService<string, FeatureAggregate>
{
  private readonly logger = new Logger(AssertFeatureExistsService.name);

  constructor(
    @Inject(FEATURE_WRITE_REPOSITORY_TOKEN)
    private readonly featureWriteRepository: IFeatureWriteRepository,
  ) {}

  async execute(id: string): Promise<FeatureAggregate> {
    this.logger.log(`Asserting feature exists by id: ${id}`);

    // 01: Find the feature by id
    const existingFeature = await this.featureWriteRepository.findById(id);

    // 02: If the feature does not exist, throw an error
    if (!existingFeature) {
      this.logger.error(`Feature not found by id: ${id}`);
      throw new FeatureNotFoundException(id);
    }

    return existingFeature;
  }
}
