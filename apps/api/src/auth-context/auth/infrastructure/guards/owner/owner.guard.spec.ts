import { OwnerGuard } from '@/auth-context/auth/infrastructure/guards/owner/owner.guard';
import { UserRoleEnum } from '@/prisma/master/client';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

jest.mock('@nestjs/graphql');

describe('OwnerGuard', () => {
  let guard: OwnerGuard;
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
      getArgs: jest.fn().mockReturnValue({
        input: { id: null },
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

    guard = new OwnerGuard();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow access when user is admin', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const resourceId = '123e4567-e89b-12d3-a456-426614174001';
      mockRequest.user = { role: UserRoleEnum.ADMIN, userId };
      mockGqlContext.getArgs.mockReturnValue({ input: { id: resourceId } });

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should allow access when user is modifying their own resource', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      mockRequest.user = { role: UserRoleEnum.USER, userId };
      mockGqlContext.getArgs.mockReturnValue({ input: { id: userId } });

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      mockRequest.user = null;
      mockGqlContext.getArgs.mockReturnValue({
        input: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'User not authenticated',
      );
    });

    it('should throw ForbiddenException when resource ID is not provided', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      mockRequest.user = { role: UserRoleEnum.USER, userId };
      mockGqlContext.getArgs.mockReturnValue({ input: {} });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'Resource ID is required',
      );
    });

    it('should throw ForbiddenException when user ID is not in token', () => {
      const resourceId = '123e4567-e89b-12d3-a456-426614174000';
      mockRequest.user = { role: UserRoleEnum.USER };
      mockGqlContext.getArgs.mockReturnValue({ input: { id: resourceId } });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'User ID not found in token',
      );
    });

    it('should throw ForbiddenException when user tries to modify another user resource', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const resourceId = '123e4567-e89b-12d3-a456-426614174001';
      mockRequest.user = { role: UserRoleEnum.USER, userId };
      mockGqlContext.getArgs.mockReturnValue({ input: { id: resourceId } });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'You can only access/modify your own resources',
      );
    });

    it('should handle null input gracefully', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      mockRequest.user = { role: UserRoleEnum.USER, userId };
      mockGqlContext.getArgs.mockReturnValue({ input: null });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'Resource ID is required',
      );
    });
  });
});
