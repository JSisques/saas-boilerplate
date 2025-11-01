import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { IJwtPayload } from '@/auth-context/auth/domain/interfaces/jwt-payload.interface';
import {
  AUTH_WRITE_REPOSITORY_TOKEN,
  AuthWriteRepository,
} from '@/auth-context/auth/domain/repositories/auth-write.repository';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT Strategy
 * Passport strategy for JWT authentication
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(AUTH_WRITE_REPOSITORY_TOKEN)
    private readonly authWriteRepository: AuthWriteRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') || 'access-secret',
    });
  }

  /**
   * Validate JWT payload
   * @param payload - Decoded JWT payload
   * @returns User authentication data
   */
  async validate(payload: IJwtPayload): Promise<AuthAggregate> {
    this.logger.log(`Validating JWT payload: ${JSON.stringify(payload)}`);

    // Find auth by auth ID
    const auth = await this.authWriteRepository.findById(payload.id);

    if (!auth) {
      throw new UnauthorizedException('User not found');
    }

    // Return the auth aggregate that will be attached to request.user
    return auth;
  }
}
