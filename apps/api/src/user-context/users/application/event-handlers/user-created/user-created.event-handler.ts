import { UserCreatedEvent } from '@/shared/domain/events/users/user-created/user-created.event';
import { UserViewModelFactory } from '@/user-context/users/domain/factories/user-view-model/user-view-model.factory';
import {
  USER_READ_REPOSITORY_TOKEN,
  UserReadRepository,
} from '@/user-context/users/domain/repositories/user-read.repository';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  private readonly logger = new Logger(UserCreatedEventHandler.name);

  constructor(
    @Inject(USER_READ_REPOSITORY_TOKEN)
    private readonly userReadRepository: UserReadRepository,
    private readonly userViewModelFactory: UserViewModelFactory,
  ) {}

  /**
   * Handles the UserCreatedEvent event by creating a new user view model.
   *
   * @param event - The UserCreatedEvent event to handle.
   */
  async handle(event: UserCreatedEvent) {
    this.logger.log(`Handling user created event: ${event.aggregateId}`);

    // 01: Create the user view model
    const userCreatedViewModel: UserViewModel =
      this.userViewModelFactory.fromPrimitives(event.data);

    // 02: Save the user view model
    await this.userReadRepository.save(userCreatedViewModel);
  }
}
