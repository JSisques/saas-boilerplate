import { AssertAuthEmailExistsService } from '@/auth-context/auth/application/services/assert-auth-email-exists/assert-auth-email-exists.service';
import { JwtAuthService } from '@/auth-context/auth/application/services/jwt-auth/jwt-auth.service';
import { PasswordHashingService } from '@/auth-context/auth/application/services/password-hashing/password-hashing.service';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { ITokenPair } from '@/auth-context/auth/domain/interfaces/token-pair.interface';
import {
  AUTH_READ_REPOSITORY_TOKEN,
  AuthReadRepository,
} from '@/auth-context/auth/domain/repositories/auth-read.repository';
import {
  AUTH_WRITE_REPOSITORY_TOKEN,
  AuthWriteRepository,
} from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { FindTenantMemberByUserIdQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-user-id/tenant-member-find-by-user-id.query';
import { UserFindByIdQuery } from '@/user-context/users/application/queries/user-find-by-id/user-find-by-id.query';
import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
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
    private readonly passwordHashingService: PasswordHashingService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Executes the auth login command
   *
   * @param command - The command to execute
   * @returns The tokens pair
   */
  async execute(command: AuthLoginByEmailCommand): Promise<ITokenPair> {
    this.logger.log(
      `Executing login command for email: ${command.email.value}`,
    );

    // 01: Assert the auth exists by email
    const auth: AuthAggregate = await this.assertAuthEmailExistsService.execute(
      command.email.value,
    );

    // 02: Verify password
    if (!auth.password?.value) {
      this.logger.error(`No password found for auth: ${auth.id.value}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // 03: Verify password
    await this.passwordHashingService.verifyPassword(
      command.password,
      auth.password?.value,
    );

    // 04: Find the user
    const user = await this.queryBus.execute(
      new UserFindByIdQuery({ id: auth.userId.value }),
    );

    // 05: Update last login timestamp
    auth.updateLastLoginAt(new AuthLastLoginAtValueObject(new Date()));

    // 06: Save the updated auth entity
    await this.authWriteRepository.save(auth);

    // 07: Publish all events
    await this.eventBus.publishAll(auth.getUncommittedEvents());
    await auth.commit();

    // 08: Get tenant members for the user to extract tenant IDs
    const tenantMembers = await this.queryBus.execute(
      new FindTenantMemberByUserIdQuery({ id: auth.userId.value }),
    );
    const tenantIds =
      tenantMembers?.map((member) => member.tenantId.value) || [];

    // 09: Generate JWT tokens
    const tokens = this.jwtAuthService.generateTokenPair({
      id: auth.id.value,
      userId: auth.userId.value,
      email: auth.email?.value || undefined,
      username: user?.userName?.value ?? undefined,
      role: user?.role?.value ?? undefined,
      tenantIds: tenantIds,
    });

    this.logger.log(`Login successful for auth: ${auth.id.value}`);

    return tokens;
  }
}
