import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { FeatureKeyIsNotUniqueException } from '@/feature-context/features/application/exceptions/feature-key-is-not-unique/feature-key-is-not-unique.exception';
import {
  FEATURE_WRITE_REPOSITORY_TOKEN,
  IFeatureWriteRepository,
} from '@/feature-context/features/domain/repositories/feature-write.repository';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertFeatureKeyIsUniqueService
  implements IBaseService<string, void>
{
  private readonly logger = new Logger(AssertFeatureKeyIsUniqueService.name);

  constructor(
    @Inject(FEATURE_WRITE_REPOSITORY_TOKEN)
    private readonly featureWriteRepository: IFeatureWriteRepository,
  ) {}

  async execute(key: string): Promise<void> {
    this.logger.log(`Asserting feature key is unique by key: ${key}`);

    // 01: Find the feature by key
    const existingFeature = await this.featureWriteRepository.findByKey(
      new FeatureKeyValueObject(key),
    );

    // 02: If the feature exists, throw an error
    if (existingFeature) {
      this.logger.error(`Feature key ${key} is already taken`);
      throw new FeatureKeyIsNotUniqueException(key);
    }
  }
}
