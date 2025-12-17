import { IFeatureCreateCommandDto } from '@/feature-context/features/application/dtos/commands/feature-create/feature-create-command.dto';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';

export class FeatureCreateCommand {
  readonly id: FeatureUuidValueObject;
  readonly key: FeatureKeyValueObject;
  readonly name: FeatureNameValueObject;
  readonly description: FeatureDescriptionValueObject | null;
  readonly status: FeatureStatusValueObject;

  constructor(props: IFeatureCreateCommandDto) {
    this.id = new FeatureUuidValueObject();

    this.key = new FeatureKeyValueObject(props.key);
    this.name = new FeatureNameValueObject(props.name);

    this.description = props.description
      ? new FeatureDescriptionValueObject(props.description)
      : null;

    this.status = new FeatureStatusValueObject(
      props.status !== undefined ? props.status : FeatureStatusEnum.ACTIVE,
    );
  }
}
