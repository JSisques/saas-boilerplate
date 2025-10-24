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

  async handle(event: UserUpdatedEvent) {
    this.logger.log(`Handling user updated event: ${event.aggregateId}`);

    // 01: Find the existing user view model
    const existingUserViewModel: UserViewModel | null =
      await this.userReadRepository.findById(event.aggregateId);

    if (!existingUserViewModel) {
      this.logger.error(`User not found by id: ${event.aggregateId}`);
      throw new UserNotFoundException(event.aggregateId);
    }

    // 02: Update the existing view model with new data
    existingUserViewModel.update({
      name: event.data.name,
      bio: event.data.bio,
      avatar: event.data.avatar,
    });

    // 03: Save the updated user view model
    await this.userReadRepository.save(existingUserViewModel);
  }
}
