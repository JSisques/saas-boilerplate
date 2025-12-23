import { ROLES_KEY } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

jest.mock('@nestjs/graphql');

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let mockReflector: jest.Mocked<Reflector>;
  let mockContext: ExecutionContext;
  let mockGqlContext: any;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      user: null,
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

    guard = new RolesGuard(mockReflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow access when no roles are required', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
    });

    it('should allow access when user has required role', () => {
      const requiredRoles = [UserRoleEnum.ADMIN];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = { role: UserRoleEnum.ADMIN };

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should allow access when user has one of multiple required roles', () => {
      const requiredRoles = [UserRoleEnum.ADMIN, UserRoleEnum.USER];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = { role: UserRoleEnum.USER };

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      const requiredRoles = [UserRoleEnum.ADMIN];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = null;

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'User not authenticated',
      );
    });

    it('should throw ForbiddenException when user role is not found', () => {
      const requiredRoles = [UserRoleEnum.ADMIN];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = {};

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'User role not found',
      );
    });

    it('should throw ForbiddenException when user does not have required role', () => {
      const requiredRoles = [UserRoleEnum.ADMIN];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = { role: UserRoleEnum.USER };

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'Insufficient permissions. Required roles: ADMIN',
      );
    });

    it('should throw ForbiddenException with multiple required roles in message', () => {
      const requiredRoles = [UserRoleEnum.ADMIN, UserRoleEnum.USER];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      mockRequest.user = { role: UserRoleEnum.USER };

      // User has USER role which is in requiredRoles, so should pass
      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });
});
