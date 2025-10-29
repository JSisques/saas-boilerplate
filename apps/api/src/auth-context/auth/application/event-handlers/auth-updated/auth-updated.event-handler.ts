import { AssertAuthViewModelExsistsService } from '@/auth-context/auth/application/services/assert-auth-view-model-exsists/assert-auth-view-model-exsists.service';
import {
  AUTH_READ_REPOSITORY_TOKEN,
  AuthReadRepository,
} from '@/auth-context/auth/domain/repositories/auth-read.repository';
import { AuthUpdatedEvent } from '@/shared/domain/events/auth/auth-updated/auth-updated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AuthUpdatedEvent)
export class AuthUpdatedEventHandler
  implements IEventHandler<AuthUpdatedEvent>
{
  private readonly logger = new Logger(AuthUpdatedEventHandler.name);

  constructor(
    @Inject(AUTH_READ_REPOSITORY_TOKEN)
    private readonly authReadRepository: AuthReadRepository,
    private readonly assertAuthViewModelExsistsService: AssertAuthViewModelExsistsService,
  ) {}

  /**
   * Handles the AuthUpdatedEvent event by updating the existing auth view model.
   *
   * @param event - The AuthUpdatedEvent event to handle.
   */
  async handle(event: AuthUpdatedEvent) {
    this.logger.log(`Handling auth updated event: ${event.aggregateId}`);

    // 01: Assert the auth view model exists
    const existingAuthViewModel =
      await this.assertAuthViewModelExsistsService.execute(event.aggregateId);

    // 02: Update the existing view model with new data
    existingAuthViewModel.update(event.data);

    // 03: Save the updated auth view model
    await this.authReadRepository.save(existingAuthViewModel);
  }
}
