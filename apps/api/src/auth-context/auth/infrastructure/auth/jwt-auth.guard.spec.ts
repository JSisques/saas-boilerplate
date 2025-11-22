import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';

jest.mock('@nestjs/graphql');

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockContext: ExecutionContext;
  let mockGqlContext: any;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      headers: {},
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

    guard = new JwtAuthGuard();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRequest', () => {
    it('should extract request from GraphQL context', () => {
      const result = guard.getRequest(mockContext);

      expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockContext);
      expect(mockGqlContext.getContext).toHaveBeenCalled();
      expect(result).toBe(mockRequest);
    });

    it('should return the request object from GraphQL context', () => {
      const customRequest = { headers: { authorization: 'Bearer token' } };
      mockGqlContext.getContext.mockReturnValue({ req: customRequest });

      const result = guard.getRequest(mockContext);

      expect(result).toBe(customRequest);
    });
  });
});
