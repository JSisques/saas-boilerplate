import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { IFeatureFindByIdQueryDto } from '@/feature-context/features/application/dtos/queries/find-feature-by-id/find-feature-by-id-query.dto';

export class FindFeatureByIdQuery {
  readonly id: FeatureUuidValueObject;

  constructor(props: IFeatureFindByIdQueryDto) {
    this.id = new FeatureUuidValueObject(props.id);
  }
}
