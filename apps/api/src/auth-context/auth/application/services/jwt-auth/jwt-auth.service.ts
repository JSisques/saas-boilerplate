import { IJwtPayload } from '@/auth-context/auth/domain/interfaces/jwt-payload.interface';
import { ITokenPair } from '@/auth-context/auth/domain/interfaces/token-pair.interface';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

/**
 * JWT Service
 * Handles JWT token generation and verification
 */
@Injectable()
export class JwtAuthService {
  private readonly logger = new Logger(JwtAuthService.name);
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiration: string;
  private readonly refreshTokenExpiration: string;

  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') || 'access-secret';
    this.refreshTokenSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret';
    this.accessTokenExpiration =
      this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m';
    this.refreshTokenExpiration =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
  }

  /**
   * Generate access token
   * @param payload - JWT payload
   * @returns Access token
   */
  generateAccessToken(payload: IJwtPayload): string {
    this.logger.log(`Generating access token for user: ${payload.userId}`);
    return this.jwtService.sign(payload as any, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiration as any,
    });
  }

  /**
   * Generate refresh token
   * @param payload - JWT payload
   * @returns Refresh token
   */
  generateRefreshToken(payload: IJwtPayload): string {
    this.logger.log(`Generating refresh token for user: ${payload.userId}`);
    return this.jwtService.sign(payload as any, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiration as any,
    });
  }

  /**
   * Generate both access and refresh tokens
   * @param payload - JWT payload
   * @returns Token pair
   */
  generateTokenPair(payload: IJwtPayload): ITokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify access token
   * @param token - Access token to verify
   * @returns Decoded payload
   */
  verifyAccessToken(token: string): IJwtPayload {
    try {
      this.logger.log('Verifying access token');
      return this.jwtService.verify(token, {
        secret: this.accessTokenSecret,
      }) as IJwtPayload;
    } catch (error) {
      this.logger.error(`Access token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid access token');
    }
  }

  /**
   * Verify refresh token
   * @param token - Refresh token to verify
   * @returns Decoded payload
   */
  verifyRefreshToken(token: string): IJwtPayload {
    try {
      this.logger.log('Verifying refresh token');
      return this.jwtService.verify(token, {
        secret: this.refreshTokenSecret,
      }) as IJwtPayload;
    } catch (error) {
      this.logger.error(`Refresh token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Decode token without verification
   * @param token - Token to decode
   * @returns Decoded payload
   */
  decodeToken(token: string): IJwtPayload {
    this.logger.log('Decoding token');
    return this.jwtService.decode(token) as IJwtPayload;
  }
}
