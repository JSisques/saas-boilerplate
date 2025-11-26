import { AuthViewModelFactory } from '@/auth-context/auth/domain/factories/auth-view-model/auth-view-model.factory';
import {
  AUTH_READ_REPOSITORY_TOKEN,
  AuthReadRepository,
} from '@/auth-context/auth/domain/repositories/auth-read.repository';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { AuthRegisteredByEmailEvent } from '@/shared/domain/events/auth/auth-registered-by-email/auth-registered-by-email.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AuthRegisteredByEmailEvent)
export class AuthRegisteredByEmailEventHandler
  implements IEventHandler<AuthRegisteredByEmailEvent>
{
  private readonly logger = new Logger(AuthRegisteredByEmailEventHandler.name);

  constructor(
    @Inject(AUTH_READ_REPOSITORY_TOKEN)
    private readonly authReadRepository: AuthReadRepository,
    private readonly authViewModelFactory: AuthViewModelFactory,
  ) {}

  /**
   * Handles the AuthRegisteredEvent event by creating a new auth view model.
   *
   * @param event - The AuthRegisteredEvent event to handle.
   */
  async handle(event: AuthRegisteredByEmailEvent) {
    this.logger.log(
      `Handling auth registered by email event: ${event.aggregateId}`,
    );

    // 01: Create the auth view model
    const authRegisteredViewModel: AuthViewModel =
      this.authViewModelFactory.fromPrimitives(event.data);

    // 02: Save the auth view model
    await this.authReadRepository.save(authRegisteredViewModel);
  }
}
