import { AssertAuthEmailExistsService } from '@/auth-context/auth/application/services/assert-auth-email-exists/assert-auth-email-exists.service';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import {
  AUTH_READ_REPOSITORY_TOKEN,
  AuthReadRepository,
} from '@/auth-context/auth/domain/repositories/auth-read.repository';
import {
  AUTH_WRITE_REPOSITORY_TOKEN,
  AuthWriteRepository,
} from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthLoginByEmailCommand } from './auth-login-by-email.command';

@CommandHandler(AuthLoginByEmailCommand)
export class AuthLoginByEmailCommandHandler
  implements ICommandHandler<AuthLoginByEmailCommand>
{
  private readonly logger = new Logger(AuthLoginByEmailCommandHandler.name);

  constructor(
    @Inject(AUTH_READ_REPOSITORY_TOKEN)
    private readonly authReadRepository: AuthReadRepository,
    @Inject(AUTH_WRITE_REPOSITORY_TOKEN)
    private readonly authWriteRepository: AuthWriteRepository,
    private readonly assertAuthEmailExistsService: AssertAuthEmailExistsService,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Executes the auth login command
   *
   * @param command - The command to execute
   * @returns The auth id and user id
   */
  async execute(command: AuthLoginByEmailCommand): Promise<string> {
    this.logger.log(
      `Executing login command for email: ${command.email.value}`,
    );

    const auth: AuthAggregate = await this.assertAuthEmailExistsService.execute(
      command.email.value,
    );

    // Update last login timestamp
    auth.updateLastLoginAt(new AuthLastLoginAtValueObject(new Date()));

    // Save the updated auth entity
    await this.authWriteRepository.save(auth);

    // Publish all events
    await this.eventBus.publishAll(auth.getUncommittedEvents());
    await auth.commit();

    this.logger.log(`Login successful for auth: ${auth.id.value}`);

    return auth.id.value;
  }
}
