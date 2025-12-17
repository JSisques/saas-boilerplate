import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { FeatureNotFoundException } from '@/feature-context/features/application/exceptions/feature-not-found/feature-not-found.exception';
import {
  FEATURE_READ_REPOSITORY_TOKEN,
  IFeatureReadRepository,
} from '@/feature-context/features/domain/repositories/feature-read.repository';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertFeatureViewModelExistsService
  implements IBaseService<string, FeatureViewModel>
{
  private readonly logger = new Logger(
    AssertFeatureViewModelExistsService.name,
  );

  constructor(
    @Inject(FEATURE_READ_REPOSITORY_TOKEN)
    private readonly featureReadRepository: IFeatureReadRepository,
  ) {}

  async execute(id: string): Promise<FeatureViewModel> {
    this.logger.log(`Asserting feature view model exists by id: ${id}`);

    // 01: Find the feature by id
    const existingFeatureViewModel =
      await this.featureReadRepository.findById(id);

    // 02: If the feature view model does not exist, throw an error
    if (!existingFeatureViewModel) {
      this.logger.error(`Feature view model not found by id: ${id}`);
      throw new FeatureNotFoundException(id);
    }

    return existingFeatureViewModel;
  }
}
