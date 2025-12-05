import { IAuthRegisterByEmailCommandDto } from '@/auth-context/auth/application/dtos/commands/auth-register-by-email/auth-register-by-email-command.dto';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthPasswordValueObject } from '@/auth-context/auth/domain/value-objects/auth-password/auth-password.vo';
import { TenantNameValueObject } from '@/shared/domain/value-objects/tenant-name/tenant-name.vo';

export class AuthRegisterByEmailCommand {
  readonly email: AuthEmailValueObject;
  readonly password: AuthPasswordValueObject;
  readonly tenantName?: TenantNameValueObject;

  constructor(props: IAuthRegisterByEmailCommandDto) {
    this.email = new AuthEmailValueObject(props.email);
    this.password = new AuthPasswordValueObject(props.password);
    this.tenantName = props.tenantName
      ? new TenantNameValueObject(props.tenantName)
      : undefined;
  }
}
