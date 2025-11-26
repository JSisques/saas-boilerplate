import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class AuthNotFoundException extends BaseApplicationException {
  constructor(authId: string) {
    super(`Auth with id ${authId} not found`);
  }
}
