import { AssertAuthEmailNotExistsService } from '@/auth/application/services/assert-auth-email-not-exists/assert-auth-email-not-exists.service';
import {
  AUTH_AGGREGATE_FACTORY_TOKEN,
  AuthAggregateFactory,
} from '@/auth/domain/factories/auth-aggregate.factory';
import {
  AUTH_WRITE_REPOSITORY_TOKEN,
  AuthWriteRepository,
} from '@/auth/domain/repositories/auth-write.repository';
import { AuthEmailVerifiedValueObject } from '@/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthPasswordHashValueObject } from '@/auth/domain/value-objects/auth-password-hash/auth-password-hash.vo';
import { AuthProviderValueObject } from '@/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { UserCreateCommand } from '@/features/users/application/commands/user-create/user-create.command';
import { PasswordHashingService } from '@/shared/application/services/password-hashing/password-hashing.service';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { Inject } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { AuthProviderEnum } from '@prisma/client';
import { AuthRegisterByEmailCommand } from './auth-register-by-email.command';

@CommandHandler(AuthRegisterByEmailCommand)
export class AuthRegisterByEmailCommandHandler
  implements ICommandHandler<AuthRegisterByEmailCommand>
{
  constructor(
    @Inject(AUTH_WRITE_REPOSITORY_TOKEN)
    private readonly authWriteRepository: AuthWriteRepository,
    @Inject(AUTH_AGGREGATE_FACTORY_TOKEN)
    private readonly authAggregateFactory: AuthAggregateFactory,
    private readonly passwordHashingService: PasswordHashingService,
    private readonly assertAuthEmailNotExistsService: AssertAuthEmailNotExistsService,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Executes the auth register command
   *
   * @param command - The command to execute
   * @returns The created auth id
   */
  async execute(command: AuthRegisterByEmailCommand): Promise<string> {
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
        role: null,
        status: null,
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
      passwordHash: new AuthPasswordHashValueObject(hashedPassword),
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
