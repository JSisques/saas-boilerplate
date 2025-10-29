import { IAuthLoginByEmailCommandDto } from '@/auth-context/auth/application/dtos/commands/auth-login-by-email/auth-login-by-email-command.dto';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthPasswordHashValueObject } from '@/auth-context/auth/domain/value-objects/auth-password-hash/auth-password-hash.vo';

export class AuthLoginByEmailCommand {
  readonly email: AuthEmailValueObject;
  readonly password: AuthPasswordHashValueObject;

  constructor(props: IAuthLoginByEmailCommandDto) {
    this.email = new AuthEmailValueObject(props.email);
    this.password = new AuthPasswordHashValueObject(props.password);
  }
}
