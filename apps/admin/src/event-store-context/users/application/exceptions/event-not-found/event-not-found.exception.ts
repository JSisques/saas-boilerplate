import { BaseApplicationException } from "@repo/shared/application/exceptions/base-application.exception";

export class EventNotFoundException extends BaseApplicationException {
  constructor(eventId: string) {
    super(`Event with id ${eventId} not found`);
  }
}
