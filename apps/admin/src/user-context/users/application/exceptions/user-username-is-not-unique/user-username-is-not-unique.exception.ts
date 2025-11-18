import { BaseApplicationException } from "@repo/shared/application/exceptions/base-application.exception";

export class UserUsernameIsNotUniqueException extends BaseApplicationException {
  constructor(username: string) {
    super(`Username ${username} is already taken`);
  }
}
