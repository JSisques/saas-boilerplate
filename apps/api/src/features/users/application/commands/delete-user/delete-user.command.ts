import { IUserDeleteCommandDto } from '@/features/users/application/dtos/commands/user-delete/user-delete-command.dto';

export class UserDeleteCommand {
  readonly id: string;

  constructor(props: IUserDeleteCommandDto) {
    this.id = props.id;
  }
}
