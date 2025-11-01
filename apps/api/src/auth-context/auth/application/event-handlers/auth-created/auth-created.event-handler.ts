import { AuthViewModelFactory } from '@/auth-context/auth/domain/factories/auth-view-model.factory';
import {
  AUTH_READ_REPOSITORY_TOKEN,
  AuthReadRepository,
} from '@/auth-context/auth/domain/repositories/auth-read.repository';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { AuthCreatedEvent } from '@/shared/domain/events/auth/auth-created/auth-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AuthCreatedEvent)
export class AuthCreatedEventHandler
  implements IEventHandler<AuthCreatedEvent>
{
  private readonly logger = new Logger(AuthCreatedEventHandler.name);

  constructor(
    @Inject(AUTH_READ_REPOSITORY_TOKEN)
    private readonly authReadRepository: AuthReadRepository,
    private readonly authViewModelFactory: AuthViewModelFactory,
  ) {}

  /**
   * Handles the AuthCreatedEvent event by creating a new auth view model.
   *
   * @param event - The AuthCreatedEvent event to handle.
   */
  async handle(event: AuthCreatedEvent) {
    this.logger.log(`Handling auth created event: ${event.aggregateId}`);

    // 01: Create the auth view model
    const authCreatedViewModel: AuthViewModel =
      this.authViewModelFactory.fromPrimitives(event.data);

    // 02: Save the auth view model
    await this.authReadRepository.save(authCreatedViewModel);
  }
}
