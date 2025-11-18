import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class PromptNotFoundException extends BaseApplicationException {
  constructor(promptId: string) {
    super(`Prompt with id ${promptId} not found`);
  }
}
