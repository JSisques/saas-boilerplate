import { BaseApplicationException } from '@/shared/application/exceptions/base-application.exception';

export class UserNotFoundException extends BaseApplicationException {
  constructor(userId: string) {
    super(`User with id ${userId} not found`);
  }
}
