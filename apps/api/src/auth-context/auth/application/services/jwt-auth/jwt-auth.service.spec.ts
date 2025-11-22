import { JwtAuthService } from '@/auth-context/auth/application/services/jwt-auth/jwt-auth.service';
import { IJwtPayload } from '@/auth-context/auth/domain/interfaces/jwt-payload.interface';
import { ITokenPair } from '@/auth-context/auth/domain/interfaces/token-pair.interface';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('JwtAuthService', () => {
  let service: JwtAuthService;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      decode: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          JWT_ACCESS_SECRET: 'test-access-secret',
          JWT_REFRESH_SECRET: 'test-refresh-secret',
          JWT_ACCESS_EXPIRATION: '15m',
          JWT_REFRESH_EXPIRATION: '7d',
        };
        return config[key];
      }),
    } as unknown as jest.Mocked<ConfigService>;

    service = new JwtAuthService(mockJwtService, mockConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate access token with correct payload', () => {
      const payload: IJwtPayload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        role: 'USER',
      };
      const expectedToken = 'access-token';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = service.generateAccessToken(payload);

      expect(result).toBe(expectedToken);
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
        secret: 'test-access-secret',
        expiresIn: '15m',
      });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token with correct payload', () => {
      const payload: IJwtPayload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        role: 'USER',
      };
      const expectedToken = 'refresh-token';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = service.generateRefreshToken(payload);

      expect(result).toBe(expectedToken);
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
        secret: 'test-refresh-secret',
        expiresIn: '7d',
      });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', () => {
      const payload: IJwtPayload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        role: 'USER',
      };
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      mockJwtService.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      const result = service.generateTokenPair(payload);

      expect(result).toEqual({
        accessToken,
        refreshToken,
      });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and return payload for valid access token', () => {
      const token = 'valid-access-token';
      const expectedPayload: IJwtPayload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        role: 'USER',
      };

      mockJwtService.verify.mockReturnValue(expectedPayload);

      const result = service.verifyAccessToken(token);

      expect(result).toEqual(expectedPayload);
      expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'test-access-secret',
      });
      expect(mockJwtService.verify).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException for invalid access token', () => {
      const token = 'invalid-access-token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.verifyAccessToken(token)).toThrow(
        UnauthorizedException,
      );
      expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'test-access-secret',
      });
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and return payload for valid refresh token', () => {
      const token = 'valid-refresh-token';
      const expectedPayload: IJwtPayload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        role: 'USER',
      };

      mockJwtService.verify.mockReturnValue(expectedPayload);

      const result = service.verifyRefreshToken(token);

      expect(result).toEqual(expectedPayload);
      expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'test-refresh-secret',
      });
      expect(mockJwtService.verify).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException for invalid refresh token', () => {
      const token = 'invalid-refresh-token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.verifyRefreshToken(token)).toThrow(
        UnauthorizedException,
      );
      expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'test-refresh-secret',
      });
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      const token = 'some-token';
      const expectedPayload: IJwtPayload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        role: 'USER',
      };

      mockJwtService.decode.mockReturnValue(expectedPayload);

      const result = service.decodeToken(token);

      expect(result).toEqual(expectedPayload);
      expect(mockJwtService.decode).toHaveBeenCalledWith(token);
      expect(mockJwtService.decode).toHaveBeenCalledTimes(1);
    });
  });
});

