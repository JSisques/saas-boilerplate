import { IAuthRegisterByEmailCommandDto } from '@/auth/application/dtos/commands/auth-register-by-email/auth-register-by-email-command.dto';
import { AuthEmailValueObject } from '@/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthPasswordHashValueObject } from '@/auth/domain/value-objects/auth-password-hash/auth-password-hash.vo';

export class AuthRegisterByEmailCommand {
  readonly email: AuthEmailValueObject;
  readonly password: AuthPasswordHashValueObject;

  constructor(props: IAuthRegisterByEmailCommandDto) {
    this.email = new AuthEmailValueObject(props.email);
    this.password = new AuthPasswordHashValueObject(props.password);
  }
}
