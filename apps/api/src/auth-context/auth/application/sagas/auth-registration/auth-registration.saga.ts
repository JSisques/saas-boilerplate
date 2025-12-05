import { AuthCreateCommand } from '@/auth-context/auth/application/commands/auth-create/auth-create.command';
import { AuthDeleteCommand } from '@/auth-context/auth/application/commands/auth-delete/auth-delete.command';
import { IAuthCreateCommandDto } from '@/auth-context/auth/application/dtos/commands/auth-create/auth-create-command.dto';
import { BaseSaga } from '@/shared/application/sagas/base-saga/base-saga';
import { AuthRegistrationRequestedEvent } from '@/shared/domain/events/auth/auth-registration-requested/auth-registration-requested.event';
import { TenantMemberAddCommand } from '@/tenant-context/tenant-members/application/commands/tenant-member-add/tenant-member-add.command';
import { TenantMemberRemoveCommand } from '@/tenant-context/tenant-members/application/commands/tenant-member-remove/tenant-member-remove.command';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantCreateCommand } from '@/tenant-context/tenants/application/commands/tenant-create/tenant-create.command';
import { TenantDeleteCommand } from '@/tenant-context/tenants/application/commands/tenant-delete/tenant-delete.command';
import { UserDeleteCommand } from '@/user-context/users/application/commands/delete-user/delete-user.command';
import { UserCreateCommand } from '@/user-context/users/application/commands/user-create/user-create.command';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

/**
 * Saga that orchestrates the complete user registration flow:
 * 1. Create user
 * 2. Create auth
 * 3. If tenantName is provided in the event, create tenant
 * 4. Associate user as tenant member with OWNER role
 *
 * Compensation flow (in reverse order):
 * - Delete tenant member (if created)
 * - Delete tenant (if created)
 * - Delete user
 * - Delete auth
 *
 * Note: This saga is called synchronously from AuthRegisterByEmailCommandHandler
 * to provide immediate feedback to the client. It's not registered as an event handler
 * to avoid duplicate execution.
 */
@Injectable()
export class AuthRegistrationSaga extends BaseSaga {
  private compensationActions: Array<() => Promise<void>> = [];

  constructor(commandBus: CommandBus) {
    super(commandBus);
  }

  async handle(event: AuthRegistrationRequestedEvent): Promise<void> {
    const authId = event.aggregateId;
    const userId = event.data.userId;
    const tenantName = event.data.tenantName;

    this.logger.log(
      `🚀 Starting complete user registration SAGA for auth: ${authId}, user: ${userId}${tenantName ? `, tenant: ${tenantName}` : ''}`,
    );

    const sagaInstanceId = await this.createSagaInstance(
      `Complete User Registration for Auth ${authId}`,
    );

    try {
      // Step 1: Create user
      const userResult = await this.executeStep(sagaInstanceId, {
        name: 'Create User',
        order: 1,
        payload: {},
        action: () => this.createUserStep(),
      });
      const userId = userResult.userId;

      // Register compensation: delete user
      this.compensationActions.push(async () => {
        this.logger.log(`🔄 Compensating: Deleting user ${userId}`);
        try {
          await this.commandBus.execute(new UserDeleteCommand({ id: userId }));
        } catch (compensationError) {
          this.logger.error(
            `❌ Failed to delete user ${userId} during compensation: ${compensationError}`,
          );
          // Continue with other compensations even if this fails
        }
      });

      // Step 2: Create auth
      const authResult = await this.executeStep(sagaInstanceId, {
        name: 'Create Auth',
        order: 2,
        payload: { userId, ...(event.data as IAuthCreateCommandDto) },
        action: () =>
          this.createAuthStep({
            id: event.data.id,
            userId: userId,
            email: event.data.email,
            password: event.data.password,
            emailVerified: event.data.emailVerified ?? false,
            phoneNumber: event.data.phoneNumber,
            provider: event.data.provider,
            providerId: event.data.providerId,
            twoFactorEnabled: event.data.twoFactorEnabled ?? false,
            lastLoginAt: event.data.lastLoginAt,
          }),
      });
      const createdAuthId = authResult.authId;

      // Register compensation: delete auth
      this.compensationActions.push(async () => {
        this.logger.log(`🔄 Compensating: Deleting auth ${createdAuthId}`);
        try {
          await this.commandBus.execute(
            new AuthDeleteCommand({ id: createdAuthId }),
          );
        } catch (compensationError) {
          this.logger.error(
            `❌ Failed to delete auth ${createdAuthId} during compensation: ${compensationError}`,
          );
        }
      });

      // Step 3: Create tenant (if tenantName is provided)
      if (tenantName) {
        const tenantResult = await this.executeStep(sagaInstanceId, {
          name: 'Create Tenant',
          order: 3,
          payload: { tenantName },
          action: () => this.createTenantStep(tenantName),
        });
        const createdTenantId = tenantResult.tenantId;

        // Register compensation: delete tenant
        this.compensationActions.push(async () => {
          this.logger.log(
            `🔄 Compensating: Deleting tenant ${createdTenantId}`,
          );
          try {
            await this.commandBus.execute(
              new TenantDeleteCommand({ id: createdTenantId }),
            );
          } catch (compensationError) {
            this.logger.error(
              `❌ Failed to delete tenant ${createdTenantId} during compensation: ${compensationError}`,
            );
            // Continue with other compensations even if this fails
          }
        });

        // Step 4: Associate user as tenant member (if tenant was created)
        const tenantMemberResult = await this.executeStep(sagaInstanceId, {
          name: 'Add User as Tenant Member',
          order: 4,
          payload: {
            userId,
            tenantId: createdTenantId,
            role: TenantMemberRoleEnum.OWNER,
          },
          action: () =>
            this.addTenantMemberStep(
              userId,
              createdTenantId,
              TenantMemberRoleEnum.OWNER,
            ),
        });
        const createdTenantMemberId = tenantMemberResult.tenantMemberId;

        // Register compensation: delete tenant member
        this.compensationActions.push(async () => {
          this.logger.log(
            `🔄 Compensating: Removing tenant member ${createdTenantMemberId} (user ${userId} from tenant ${createdTenantId})`,
          );
          try {
            await this.commandBus.execute(
              new TenantMemberRemoveCommand({ id: createdTenantMemberId }),
            );
          } catch (compensationError) {
            this.logger.error(
              `❌ Failed to remove tenant member ${createdTenantMemberId} during compensation: ${compensationError}`,
            );
            // Continue with other compensations even if this fails
          }
        });
      }

      await this.completeSagaInstance(sagaInstanceId);
      this.logger.log(
        `🎉 Complete user registration SAGA completed successfully for auth: ${authId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Complete user registration SAGA failed for auth: ${authId}. Error: ${error}`,
      );

      // Execute compensation in reverse order
      await this.executeCompensation();

      await this.failSagaInstance(sagaInstanceId);
      throw error;
    }
  }

  /**
   * Creates a user with the provided data
   */
  private async createUserStep(): Promise<{ userId: string }> {
    const userId = await this.commandBus.execute(
      new UserCreateCommand({
        avatarUrl: null,
        bio: null,
        lastName: null,
        name: null,
        userName: null,
      }),
    );

    this.logger.log(`✅ User created successfully: ${userId}`);

    return { userId };
  }

  /**
   * Creates an auth with the provided data
   */
  private async createAuthStep(
    authData: IAuthCreateCommandDto,
  ): Promise<{ authId: string }> {
    const authId = await this.commandBus.execute(
      new AuthCreateCommand(authData),
    );
    this.logger.log(`✅ Auth created successfully: ${authId}`);

    return { authId };
  }

  /**
   * Creates a tenant with the provided name
   */
  private async createTenantStep(tenantName: string): Promise<{
    tenantId: string;
  }> {
    const tenantId = await this.commandBus.execute(
      new TenantCreateCommand({
        name: tenantName,
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        email: null,
        phoneNumber: null,
        phoneCode: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postalCode: null,
        timezone: null,
        locale: null,
        maxUsers: null,
        maxStorage: null,
        maxApiCalls: null,
      }),
    );

    this.logger.log(`✅ Tenant created successfully: ${tenantId}`);

    return { tenantId };
  }

  /**
   * Adds a user as a tenant member with the specified role
   */
  private async addTenantMemberStep(
    userId: string,
    tenantId: string,
    role: TenantMemberRoleEnum,
  ): Promise<{ tenantMemberId: string }> {
    const tenantMemberId = await this.commandBus.execute(
      new TenantMemberAddCommand({
        tenantId,
        userId,
        role,
      }),
    );

    this.logger.log(
      `✅ User ${userId} added as tenant member with role ${role} to tenant ${tenantId}`,
    );

    return { tenantMemberId };
  }

  /**
   * Executes compensation actions in reverse order
   */
  private async executeCompensation(): Promise<void> {
    if (this.compensationActions.length === 0) {
      return;
    }

    this.logger.log(
      `🔄 Starting compensation for ${this.compensationActions.length} actions`,
    );

    // Execute compensation actions in reverse order
    for (let i = this.compensationActions.length - 1; i >= 0; i--) {
      try {
        await this.compensationActions[i]();
      } catch (compensationError) {
        this.logger.error(
          `❌ Compensation action ${i} failed: ${compensationError}`,
        );
      }
    }

    // Clear compensation actions after execution
    this.compensationActions = [];
  }
}
