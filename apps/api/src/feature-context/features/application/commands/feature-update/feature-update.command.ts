import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { IFeatureUpdateCommandDto } from '@/feature-context/features/application/dtos/commands/feature-update/feature-update-command.dto';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';

export class FeatureUpdateCommand {
  readonly id: FeatureUuidValueObject;
  readonly key?: FeatureKeyValueObject;
  readonly name?: FeatureNameValueObject;
  readonly description?: FeatureDescriptionValueObject | null;
  readonly status?: FeatureStatusValueObject;

  constructor(props: IFeatureUpdateCommandDto) {
    this.id = new FeatureUuidValueObject(props.id);

    if (props.key !== undefined) {
      this.key = new FeatureKeyValueObject(props.key);
    }

    if (props.name !== undefined) {
      this.name = new FeatureNameValueObject(props.name);
    }

    if (props.description !== undefined) {
      this.description = props.description
        ? new FeatureDescriptionValueObject(props.description)
        : null;
    }

    if (props.status !== undefined) {
      this.status = new FeatureStatusValueObject(props.status);
    }
  }
}
