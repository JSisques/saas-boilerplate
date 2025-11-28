import { TENANT_ROLES_KEY } from '@/auth-context/auth/infrastructure/decorators/tenant-roles/tenant-roles.decorator';
import { TenantRolesGuard } from '@/auth-context/auth/infrastructure/guards/tenant-roles/tenant-roles.guard';
import { TenantMemberRoleEnum } from '@/prisma/master/client';
import { FindTenantMemberByTenantIdAndUserIdQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-tenant-id-and-user-id/tenant-member-find-by-tenant-id-and-user-id.query';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { QueryBus } from '@nestjs/cqrs';
import { GqlExecutionContext } from '@nestjs/graphql';

jest.mock('@nestjs/graphql');

describe('TenantRolesGuard', () => {
  let guard: TenantRolesGuard;
  let mockReflector: jest.Mocked<Reflector>;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockContext: ExecutionContext;
  let mockGqlContext: any;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      user: null,
      headers: {},
    };

    mockGqlContext = {
      getContext: jest.fn().mockReturnValue({
        req: mockRequest,
      }),
    };

    (GqlExecutionContext.create as jest.Mock) = jest
      .fn()
      .mockReturnValue(mockGqlContext);

    mockContext = {
      switchToHttp: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as unknown as ExecutionContext;

    mockReflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    guard = new TenantRolesGuard(mockReflector, mockQueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow access when no tenant roles are required', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        TENANT_ROLES_KEY,
        [mockContext.getHandler(), mockContext.getClass()],
      );
    });

    it('should allow access when user has required tenant role', async () => {
      const requiredRoles = [TenantMemberRoleEnum.OWNER];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = { userId: '4657e342-154c-4903-8394-9b39c36440b4' };
      mockRequest.headers['x-tenant-id'] =
        'fb2dce89-a5f6-408a-9e01-8857003d9f64';

      const mockTenantMember = {
        role: {
          value: TenantMemberRoleEnum.OWNER,
        },
      } as Partial<TenantMemberAggregate>;

      mockQueryBus.execute.mockResolvedValue(
        mockTenantMember as TenantMemberAggregate,
      );

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        new FindTenantMemberByTenantIdAndUserIdQuery({
          tenantId: 'fb2dce89-a5f6-408a-9e01-8857003d9f64',
          userId: '4657e342-154c-4903-8394-9b39c36440b4',
        }),
      );
    });

    it('should allow access when user has one of multiple required tenant roles', async () => {
      const requiredRoles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
      ];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = { userId: '4657e342-154c-4903-8394-9b39c36440b4' };
      mockRequest.headers['x-tenant-id'] =
        'fb2dce89-a5f6-408a-9e01-8857003d9f64';

      const mockTenantMember = {
        role: {
          value: TenantMemberRoleEnum.ADMIN,
        },
      } as Partial<TenantMemberAggregate>;

      mockQueryBus.execute.mockResolvedValue(
        mockTenantMember as TenantMemberAggregate,
      );

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', async () => {
      const requiredRoles = [TenantMemberRoleEnum.OWNER];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = null;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        'User not authenticated',
      );
    });

    it('should throw ForbiddenException when tenant ID is not provided', async () => {
      const requiredRoles = [TenantMemberRoleEnum.OWNER];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = { userId: '4657e342-154c-4903-8394-9b39c36440b4' };
      mockRequest.headers = {};

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        'Tenant ID is required. Please provide x-tenant-id header.',
      );
    });

    it('should throw ForbiddenException when user ID is not found', async () => {
      const requiredRoles = [TenantMemberRoleEnum.OWNER];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = {};
      mockRequest.headers['x-tenant-id'] =
        'fb2dce89-a5f6-408a-9e01-8857003d9f64';

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        'User ID not found in token',
      );
    });

    it('should throw ForbiddenException when user is not a member of the tenant', async () => {
      const requiredRoles = [TenantMemberRoleEnum.OWNER];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = {
        userId: '4657e342-154c-4903-8394-9b39c36440b4',
      };
      mockRequest.headers['x-tenant-id'] =
        'fb2dce89-a5f6-408a-9e01-8857003d9f64';

      mockQueryBus.execute.mockResolvedValue(null);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        'User is not a member of this tenant',
      );
    });

    it('should throw ForbiddenException when user does not have required tenant role', async () => {
      const requiredRoles = [TenantMemberRoleEnum.OWNER];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = { userId: '4657e342-154c-4903-8394-9b39c36440b4' };
      mockRequest.headers['x-tenant-id'] =
        'fb2dce89-a5f6-408a-9e01-8857003d9f64';

      const mockTenantMember = {
        role: {
          value: TenantMemberRoleEnum.MEMBER,
        },
      } as Partial<TenantMemberAggregate>;

      mockQueryBus.execute.mockResolvedValue(
        mockTenantMember as TenantMemberAggregate,
      );

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        'Insufficient tenant permissions. Required roles: OWNER. Your role: MEMBER',
      );
    });

    it('should accept tenant ID from request.tenantId', async () => {
      const requiredRoles = [TenantMemberRoleEnum.ADMIN];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = { userId: '4657e342-154c-4903-8394-9b39c36440b4' };
      mockRequest.tenantId = 'fb2dce89-a5f6-408a-9e01-8857003d9f64';
      mockRequest.headers = {};

      const mockTenantMember = {
        role: {
          value: TenantMemberRoleEnum.ADMIN,
        },
      } as Partial<TenantMemberAggregate>;

      mockQueryBus.execute.mockResolvedValue(
        mockTenantMember as TenantMemberAggregate,
      );

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        new FindTenantMemberByTenantIdAndUserIdQuery({
          tenantId: 'fb2dce89-a5f6-408a-9e01-8857003d9f64',
          userId: '4657e342-154c-4903-8394-9b39c36440b4',
        }),
      );
    });
  });
});
