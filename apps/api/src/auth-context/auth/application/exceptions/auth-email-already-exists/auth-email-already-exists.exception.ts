import { BaseApplicationException } from '@/shared/application/exceptions/base-application.exception';

export class AuthEmailAlreadyExistsException extends BaseApplicationException {
  constructor(email: string) {
    super(`Auth email ${email} already exists`);
  }
}
