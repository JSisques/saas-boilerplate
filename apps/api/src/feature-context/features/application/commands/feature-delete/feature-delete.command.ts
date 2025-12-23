import { IFeatureDeleteCommandDto } from '@/feature-context/features/application/dtos/commands/feature-delete/feature-delete-command.dto';

export class FeatureDeleteCommand {
  readonly id: string;

  constructor(props: IFeatureDeleteCommandDto) {
    this.id = props.id;
  }
}
