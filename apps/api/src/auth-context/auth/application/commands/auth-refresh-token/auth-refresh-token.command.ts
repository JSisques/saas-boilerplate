import { IAuthRefreshTokenCommandDto } from '@/auth-context/auth/application/dtos/commands/auth-refresh-token/auth-refresh-token-command.dto';
import { AuthRefreshTokenValueObject } from '@/auth-context/auth/domain/value-objects/auth-refresh-token/auth-refresh-token.vo';

export class AuthRefreshTokenCommand {
  readonly refreshToken: AuthRefreshTokenValueObject;

  constructor(props: IAuthRefreshTokenCommandDto) {
    this.refreshToken = new AuthRefreshTokenValueObject(props.refreshToken);
  }
}
