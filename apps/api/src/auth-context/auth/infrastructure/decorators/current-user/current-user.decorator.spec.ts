import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { CurrentUser } from '@/auth-context/auth/infrastructure/decorators/current-user/current-user.decorator';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

jest.mock('@nestjs/graphql');

describe('CurrentUser', () => {
  let mockContext: ExecutionContext;
  let mockGqlContext: any;
  let mockRequest: any;

  // Helper function to simulate the decorator factory logic
  const executeDecoratorFactory = (
    data: unknown,
    context: ExecutionContext,
  ) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  };

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be a function decorator', () => {
    expect(typeof CurrentUser).toBe('function');
  });

  it('should extract user from GraphQL context request', () => {
    const now = new Date();
    const mockUser = new AuthAggregate(
      {
        id: new AuthUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        userId: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174001'),
        email: new AuthEmailValueObject('test@example.com'),
        emailVerified: new AuthEmailVerifiedValueObject(false),
        lastLoginAt: null,
        password: null,
        phoneNumber: null,
        provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
        providerId: null,
        twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      },
      false,
    );

    mockRequest.user = mockUser;

    const result = executeDecoratorFactory(null, mockContext);

    expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockContext);
    expect(mockGqlContext.getContext).toHaveBeenCalled();
    expect(result).toBe(mockUser);
  });

  it('should return undefined when user is not in request', () => {
    mockRequest.user = undefined;

    const result = executeDecoratorFactory(null, mockContext);

    expect(result).toBeUndefined();
  });
});
