import {
  USER_VIEW_MODEL_FACTORY_TOKEN,
  UserViewModelFactory,
} from '@/features/users/domain/factories/user-view-model.factory';
import {
  USER_READ_REPOSITORY_TOKEN,
  UserReadRepository,
} from '@/features/users/domain/repositories/user-read.repository';
import { UserCreatedEvent } from '@/shared/domain/events/users/user-created/user-created.event';
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
    @Inject(USER_VIEW_MODEL_FACTORY_TOKEN)
    private readonly userViewModelFactory: UserViewModelFactory,
  ) {}

  async handle(event: UserCreatedEvent) {
    this.logger.log(`Handling user created event: ${event.aggregateId}`);

    // 01: Create the user view model
    const userCreatedViewModel = this.userViewModelFactory.fromPrimitives(
      event.data,
    );

    // 02: Save the user view model
    await this.userReadRepository.save(userCreatedViewModel);
  }
}
