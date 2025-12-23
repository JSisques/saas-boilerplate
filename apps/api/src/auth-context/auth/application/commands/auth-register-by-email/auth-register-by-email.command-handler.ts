import { AuthRegistrationSaga } from '@/auth-context/auth/application/sagas/auth-registration/auth-registration.saga';
import { AssertAuthEmailNotExistsService } from '@/auth-context/auth/application/services/assert-auth-email-not-exists/assert-auth-email-not-exists.service';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthRegistrationRequestedEvent } from '@/shared/domain/events/auth/auth-registration-requested/auth-registration-requested.event';
import { IAuthEventData } from '@/shared/domain/events/auth/interfaces/auth-event-data.interface';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRegisterByEmailCommand } from './auth-register-by-email.command';

@CommandHandler(AuthRegisterByEmailCommand)
export class AuthRegisterByEmailCommandHandler
  implements ICommandHandler<AuthRegisterByEmailCommand>
{
  private readonly logger = new Logger(AuthRegisterByEmailCommandHandler.name);

  constructor(
    private readonly assertAuthEmailNotExistsService: AssertAuthEmailNotExistsService,
    private readonly authRegistrationSaga: AuthRegistrationSaga,
  ) {}

  /**
   * Executes the auth register command
   *
   * @param command - The command to execute
   * @returns The created auth id
   */
  async execute(command: AuthRegisterByEmailCommand): Promise<string> {
    this.logger.log(
      `Executing auth register command by email: ${command.email.value}`,
    );
    // 01: Assert the auth email not exists
    await this.assertAuthEmailNotExistsService.execute(command.email.value);

    const now = new Date();
    const eventData: IAuthEventData = {
      id: new AuthUuidValueObject().value,
      userId: new UserUuidValueObject().value,
      email: command.email.value,
      emailVerified: false,
      phoneNumber: null,
      lastLoginAt: null,
      password: command.password.value,
      provider: AuthProviderEnum.LOCAL,
      providerId: null,
      twoFactorEnabled: false,
      tenantName: command.tenantName?.value,
      createdAt: now,
      updatedAt: now,
    };

    const registrationEvent = new AuthRegistrationRequestedEvent(
      {
        aggregateId: eventData.id,
        aggregateType: AuthAggregate.name,
        eventType: AuthRegistrationRequestedEvent.name,
      },
      eventData,
    );

    // 03: Execute the saga synchronously to wait for completion
    // This ensures the client gets immediate feedback on success/failure
    // The saga will handle all the registration steps (create user, auth, tenant, etc.)
    await this.authRegistrationSaga.handle(registrationEvent);

    // 05: Return the auth id
    return eventData.id;
  }
}
