import { UserNotFoundException } from '@/features/users/application/exceptions/user-not-found/user-not-found.exception';
import {
  USER_READ_REPOSITORY_TOKEN,
  UserReadRepository,
} from '@/features/users/domain/repositories/user-read.repository';
import { UserViewModel } from '@/features/users/domain/view-models/user.view-model';
import { UserUpdatedEvent } from "@/shared/domain/events/users/user-updated-import { UserIntegrationEventData } from '@/shared/application/integration-events/users/interfaces/user-updated/user-updated.event";
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedEventHandler
  implements IEventHandler<UserUpdatedEvent>
{
  private readonly logger = new Logger(UserUpdatedEventHandler.name);

  constructor(
    @Inject(USER_READ_REPOSITORY_TOKEN)
    private readonly userReadRepository: UserReadRepository,
  ) {}

  /**
   * Handles the UserUpdatedEvent event by updating the existing user view model.
   *
   * @param event - The UserUpdatedEvent event to handle.
   */
  async handle(event: UserUpdatedEvent) {
    this.logger.log(`Handling user updated event: ${event.aggregateId}`);

    // 01: Find the existing user view model
    const existingUserViewModel: UserViewModel | null =
      await this.userReadRepository.findById(event.aggregateId);

    // 02: If the user does not exist, throw an error
    if (!existingUserViewModel) {
      this.logger.error(`User not found by id: ${event.aggregateId}`);
      throw new UserNotFoundException(event.aggregateId);
    }

    // 03: Update the existing view model with new data
    existingUserViewModel.update(event.data);

    // 04: Save the updated user view model
    await this.userReadRepository.save(existingUserViewModel);
  }
}
