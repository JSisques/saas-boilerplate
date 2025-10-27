import { BaseApplicationException } from '@/shared/application/exceptions/base-application.exception';

export class AuthPasswordNotProvidedException extends BaseApplicationException {
  constructor() {
    super('Auth password not provided');
  }
}
