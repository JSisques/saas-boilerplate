import { AssertAuthViewModelExsistsService } from '@/auth-context/auth/application/services/assert-auth-view-model-exsists/assert-auth-view-model-exsists.service';
import {
  AUTH_READ_REPOSITORY_TOKEN,
  AuthReadRepository,
} from '@/auth-context/auth/domain/repositories/auth-read.repository';
import { AuthLoggedInByEmailEvent } from '@/shared/domain/events/auth/auth-logged-in-by-email/auth-logged-in-by-email.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AuthLoggedInByEmailEvent)
export class AuthLoggedInByEmailEventHandler
  implements IEventHandler<AuthLoggedInByEmailEvent>
{
  private readonly logger = new Logger(AuthLoggedInByEmailEventHandler.name);

  constructor(
    @Inject(AUTH_READ_REPOSITORY_TOKEN)
    private readonly authReadRepository: AuthReadRepository,
    private readonly assertAuthViewModelExsistsService: AssertAuthViewModelExsistsService,
  ) {}

  /**
   * Handles the AuthLoggedInEvent event by updating the existing auth view model.
   *
   * @param event - The AuthLoggedInEvent event to handle.
   */
  async handle(event: AuthLoggedInByEmailEvent) {
    this.logger.log(
      `Handling auth logged in by email event: ${event.aggregateId}`,
    );

    // 01: Assert the auth view model exists
    const existingAuthViewModel =
      await this.assertAuthViewModelExsistsService.execute(event.aggregateId);

    // 02: Update the existing view model with new data (mainly lastLoginAt)
    existingAuthViewModel.update(event.data);

    // 03: Save the updated auth view model
    await this.authReadRepository.save(existingAuthViewModel);
  }
}
