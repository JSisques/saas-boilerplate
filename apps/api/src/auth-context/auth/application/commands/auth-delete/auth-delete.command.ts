import { IAuthDeleteCommandDto } from '@/auth-context/auth/application/dtos/commands/auth-delete/auth-delete-command.dto';

export class AuthDeleteCommand {
  readonly id: string;

  constructor(props: IAuthDeleteCommandDto) {
    this.id = props.id;
  }
}
