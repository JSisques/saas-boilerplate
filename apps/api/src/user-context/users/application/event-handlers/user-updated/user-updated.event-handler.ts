import { UserUpdatedEvent } from '@/shared/domain/events/users/user-updated/user-updated.event';
import { AssertUserViewModelExsistsService } from '@/user-context/users/application/services/assert-user-view-model-exsits/assert-user-view-model-exsits.service';
import {
  USER_READ_REPOSITORY_TOKEN,
  UserReadRepository,
} from '@/user-context/users/domain/repositories/user-read.repository';
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
    private readonly assertUserViewModelExsistsService: AssertUserViewModelExsistsService,
  ) {}

  /**
   * Handles the UserUpdatedEvent event by updating the existing user view model.
   *
   * @param event - The UserUpdatedEvent event to handle.
   */
  async handle(event: UserUpdatedEvent) {
    this.logger.log(`Handling user updated event: ${event.aggregateId}`);

    // 01: Assert the user view model exists
    const existingUserViewModel =
      await this.assertUserViewModelExsistsService.execute(event.aggregateId);

    // 02: Update the existing view model with new data
    existingUserViewModel.update(event.data);

    // 03: Save the updated user view model
    await this.userReadRepository.save(existingUserViewModel);
  }
}
