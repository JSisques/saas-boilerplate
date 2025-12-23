import { IFeatureChangeStatusCommandDto } from '@/feature-context/features/application/dtos/commands/feature-change-status/feature-change-status-command.dto';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';

export class FeatureChangeStatusCommand {
  readonly id: FeatureUuidValueObject;
  readonly status: FeatureStatusValueObject;

  constructor(props: IFeatureChangeStatusCommandDto) {
    this.id = new FeatureUuidValueObject(props.id);
    this.status = new FeatureStatusValueObject(props.status);
  }
}
