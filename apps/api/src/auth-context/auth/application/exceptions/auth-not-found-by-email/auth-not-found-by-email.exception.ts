import { BaseApplicationException } from '@/shared/application/exceptions/base-application.exception';

export class AuthNotFoundByEmailException extends BaseApplicationException {
  constructor(email: string) {
    super(`Auth with email ${email} not found`);
  }
}
