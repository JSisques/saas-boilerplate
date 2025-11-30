import { AssertAuthExistsService } from '@/auth-context/auth/application/services/assert-auth-exsists/assert-auth-exsists.service';
import { JwtAuthService } from '@/auth-context/auth/application/services/jwt-auth/jwt-auth.service';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { FindTenantMemberByUserIdQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-user-id/tenant-member-find-by-user-id.query';
import { UserFindByIdQuery } from '@/user-context/users/application/queries/user-find-by-id/user-find-by-id.query';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { AuthRefreshTokenCommand } from './auth-refresh-token.command';

@CommandHandler(AuthRefreshTokenCommand)
export class AuthRefreshTokenCommandHandler
  implements ICommandHandler<AuthRefreshTokenCommand>
{
  private readonly logger = new Logger(AuthRefreshTokenCommandHandler.name);

  constructor(
    private readonly assertAuthExistsService: AssertAuthExistsService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Executes the auth refresh token command
   *
   * @param command - The command to execute
   * @returns The new access token
   */
  async execute(command: AuthRefreshTokenCommand): Promise<string> {
    this.logger.log('Executing refresh token command');

    // 01: Verify and decode the refresh token
    const payload = this.jwtAuthService.verifyRefreshToken(
      command.refreshToken.value,
    );

    // 02: Assert the auth exists
    const auth: AuthAggregate = await this.assertAuthExistsService.execute(
      payload.id,
    );

    // 03: Find the user
    const user = await this.queryBus.execute(
      new UserFindByIdQuery({ id: auth.userId.value }),
    );

    // 04: Get tenant members for the user to extract tenant IDs
    const tenantMembers = await this.queryBus.execute(
      new FindTenantMemberByUserIdQuery({ id: auth.userId.value }),
    );
    const tenantIds =
      tenantMembers?.map((member) => member.tenantId.value) || [];

    // 05: Generate new access token with current user data
    const newAccessToken = this.jwtAuthService.generateAccessToken({
      id: auth.id.value,
      userId: auth.userId.value,
      email: auth.email?.value || undefined,
      username: user?.userName?.value ?? undefined,
      role: user?.role?.value ?? undefined,
      tenantIds: tenantIds,
    });

    this.logger.log(`New access token generated for auth: ${auth.id.value}`);

    return newAccessToken;
  }
}
