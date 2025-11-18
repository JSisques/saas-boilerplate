import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class UserUsernameIsNotUniqueException extends BaseApplicationException {
  constructor(username: string) {
    super(`Username ${username} is already taken`);
  }
}
