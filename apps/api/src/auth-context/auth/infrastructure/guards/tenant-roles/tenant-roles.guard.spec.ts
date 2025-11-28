import { TENANT_ROLES_KEY } from '@/auth-context/auth/infrastructure/decorators/tenant-roles/tenant-roles.decorator';
import { TenantRolesGuard } from '@/auth-context/auth/infrastructure/guards/tenant-roles/tenant-roles.guard';
import { TenantMemberRoleEnum } from '@/prisma/master/client';
import {
  TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
  TenantMemberWriteRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import {
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

jest.mock('@nestjs/graphql');

describe('TenantRolesGuard', () => {
  let guard: TenantRolesGuard;
  let mockReflector: jest.Mocked<Reflector>;
  let mockTenantMemberRepository: jest.Mocked<TenantMemberWriteRepository>;
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

    mockTenantMemberRepository = {
      findById: jest.fn(),
      findByTenantId: jest.fn(),
      findByUserId: jest.fn(),
      findByTenantIdAndUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberWriteRepository>;

    guard = new TenantRolesGuard(
      mockReflector,
      mockTenantMemberRepository,
    );
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
      mockRequest.user = { userId: 'user-123' };
      mockRequest.headers['x-tenant-id'] = 'tenant-123';

      const mockTenantMember = {
        role: {
          value: TenantMemberRoleEnum.OWNER,
        },
      } as Partial<TenantMemberAggregate>;

      mockTenantMemberRepository.findByTenantIdAndUserId.mockResolvedValue(
        mockTenantMember as TenantMemberAggregate,
      );

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(
        mockTenantMemberRepository.findByTenantIdAndUserId,
      ).toHaveBeenCalledWith('tenant-123', 'user-123');
    });

    it('should allow access when user has one of multiple required tenant roles', async () => {
      const requiredRoles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
      ];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = { userId: 'user-123' };
      mockRequest.headers['x-tenant-id'] = 'tenant-123';

      const mockTenantMember = {
        role: {
          value: TenantMemberRoleEnum.ADMIN,
        },
      } as Partial<TenantMemberAggregate>;

      mockTenantMemberRepository.findByTenantIdAndUserId.mockResolvedValue(
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
      mockRequest.user = { userId: 'user-123' };
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
      mockRequest.headers['x-tenant-id'] = 'tenant-123';

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
      mockRequest.user = { userId: 'user-123' };
      mockRequest.headers['x-tenant-id'] = 'tenant-123';

      mockTenantMemberRepository.findByTenantIdAndUserId.mockResolvedValue(
        null,
      );

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
      mockRequest.user = { userId: 'user-123' };
      mockRequest.headers['x-tenant-id'] = 'tenant-123';

      const mockTenantMember = {
        role: {
          value: TenantMemberRoleEnum.MEMBER,
        },
      } as Partial<TenantMemberAggregate>;

      mockTenantMemberRepository.findByTenantIdAndUserId.mockResolvedValue(
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
      mockRequest.user = { userId: 'user-123' };
      mockRequest.tenantId = 'tenant-456';
      mockRequest.headers = {};

      const mockTenantMember = {
        role: {
          value: TenantMemberRoleEnum.ADMIN,
        },
      } as Partial<TenantMemberAggregate>;

      mockTenantMemberRepository.findByTenantIdAndUserId.mockResolvedValue(
        mockTenantMember as TenantMemberAggregate,
      );

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(
        mockTenantMemberRepository.findByTenantIdAndUserId,
      ).toHaveBeenCalledWith('tenant-456', 'user-123');
    });
  });
});

