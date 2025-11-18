import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class AuthEmailNotProvidedException extends BaseApplicationException {
  constructor() {
    super('Auth email not provided');
  }
}
