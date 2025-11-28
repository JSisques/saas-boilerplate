import { BaseApplicationException } from '@repo/shared/application/exceptions/base-application.exception';

export class AuthNotFoundException extends BaseApplicationException {
  constructor(authId: string) {
    super(`Auth with id ${authId} not found`);
  }
}
