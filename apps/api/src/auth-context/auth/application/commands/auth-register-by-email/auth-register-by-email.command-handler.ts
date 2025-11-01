import { AssertAuthEmailNotExistsService } from '@/auth-context/auth/application/services/assert-auth-email-not-exists/assert-auth-email-not-exists.service';
import { PasswordHashingService } from '@/auth-context/auth/application/services/password-hashing/password-hashing.service';
import { AuthAggregateFactory } from '@/auth-context/auth/domain/factories/auth-aggregate.factory';
import {
  AUTH_WRITE_REPOSITORY_TOKEN,
  AuthWriteRepository,
} from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthPasswordValueObject } from '@/auth-context/auth/domain/value-objects/auth-password/auth-password.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UserCreateCommand } from '@/user-context/users/application/commands/user-create/user-create.command';
import { Inject, Logger } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { AuthProviderEnum } from '@prisma/client';
import { AuthRegisterByEmailCommand } from './auth-register-by-email.command';

@CommandHandler(AuthRegisterByEmailCommand)
export class AuthRegisterByEmailCommandHandler
  implements ICommandHandler<AuthRegisterByEmailCommand>
{
  private readonly logger = new Logger(AuthRegisterByEmailCommandHandler.name);

  constructor(
    @Inject(AUTH_WRITE_REPOSITORY_TOKEN)
    private readonly authWriteRepository: AuthWriteRepository,
    private readonly authAggregateFactory: AuthAggregateFactory,
    private readonly passwordHashingService: PasswordHashingService,
    private readonly assertAuthEmailNotExistsService: AssertAuthEmailNotExistsService,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
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

    // 02: Create the user
    const newUserId = await this.commandBus.execute(
      new UserCreateCommand({
        avatarUrl: null,
        bio: null,
        lastName: null,
        name: null,
        userName: null,
      }),
    );

    const hashedPassword = await this.passwordHashingService.hashPassword(
      command.password,
    );

    // 01: Create the auth entity
    const auth = this.authAggregateFactory.create({
      id: new AuthUuidValueObject(AuthUuidValueObject.generate().value),
      userId: new UserUuidValueObject(newUserId),
      email: command.email,
      emailVerified: new AuthEmailVerifiedValueObject(false),
      lastLoginAt: null,
      password: new AuthPasswordValueObject(hashedPassword),
      phoneNumber: null,
      provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
      providerId: null,
      twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
    });

    // 02: Save the auth entity
    await this.authWriteRepository.save(auth);

    // 03: Publish all events
    await this.eventBus.publishAll(auth.getUncommittedEvents());
    await auth.commit();

    // 04: Return the auth id
    return auth.id.value;
  }
}
