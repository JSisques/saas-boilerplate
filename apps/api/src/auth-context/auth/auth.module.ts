import { AuthCreateCommandHandler } from '@/auth-context/auth/application/commands/auth-create/auth-create.command-handler';
import { AuthDeleteCommandHandler } from '@/auth-context/auth/application/commands/auth-delete/auth-delete.command-handler';
import { AuthLoginByEmailCommandHandler } from '@/auth-context/auth/application/commands/auth-login-by-email/auth-login-by-email.command-handler';
import { AuthRefreshTokenCommandHandler } from '@/auth-context/auth/application/commands/auth-refresh-token/auth-refresh-token.command-handler';
import { AuthRegisterByEmailCommandHandler } from '@/auth-context/auth/application/commands/auth-register-by-email/auth-register-by-email.command-handler';
import { AuthCreatedEventHandler } from '@/auth-context/auth/application/event-handlers/auth-created/auth-created.event-handler';
import { AuthLoggedInByEmailEventHandler } from '@/auth-context/auth/application/event-handlers/auth-logged-in-by-email/auth-logged-in-by-email.event-handler';
import { AuthRegisteredByEmailEventHandler } from '@/auth-context/auth/application/event-handlers/auth-registered-by-email/auth-registered-by-email.event-handler';
import { AuthUpdatedEventHandler } from '@/auth-context/auth/application/event-handlers/auth-updated/auth-updated.event-handler';
import { FindAuthsByCriteriaQueryHandler } from '@/auth-context/auth/application/queries/find-auths-by-criteria/find-auths-by-criteria.query-handler';
import { AuthRegistrationSaga } from '@/auth-context/auth/application/sagas/auth-registration/auth-registration.saga';
import { AssertAuthEmailExistsService } from '@/auth-context/auth/application/services/assert-auth-email-exists/assert-auth-email-exists.service';
import { AssertAuthEmailNotExistsService } from '@/auth-context/auth/application/services/assert-auth-email-not-exists/assert-auth-email-not-exists.service';
import { AssertAuthExistsService } from '@/auth-context/auth/application/services/assert-auth-exsists/assert-auth-exsists.service';
import { AssertAuthViewModelExsistsService } from '@/auth-context/auth/application/services/assert-auth-view-model-exsists/assert-auth-view-model-exsists.service';
import { JwtAuthService } from '@/auth-context/auth/application/services/jwt-auth/jwt-auth.service';
import { AuthAggregateFactory } from '@/auth-context/auth/domain/factories/auth-aggregate/auth-aggregate.factory';
import { AuthViewModelFactory } from '@/auth-context/auth/domain/factories/auth-view-model/auth-view-model.factory';
import { AUTH_READ_REPOSITORY_TOKEN } from '@/auth-context/auth/domain/repositories/auth-read.repository';
import { AUTH_WRITE_REPOSITORY_TOKEN } from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { AuthMongoDBMapper } from '@/auth-context/auth/infrastructure/database/mongodb/mappers/auth-mongodb.mapper';
import { AuthMongoRepository } from '@/auth-context/auth/infrastructure/database/mongodb/repositories/auth-mongodb.repository';
import { AuthPrismaMapper } from '@/auth-context/auth/infrastructure/database/prisma/mappers/auth-prisma.mapper';
import { AuthPrismaRepository } from '@/auth-context/auth/infrastructure/database/prisma/repositories/auth-prisma.repository';
import { OwnerGuard } from '@/auth-context/auth/infrastructure/guards/owner/owner.guard';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { TenantRolesGuard } from '@/auth-context/auth/infrastructure/guards/tenant-roles/tenant-roles.guard';
import { TenantGuard } from '@/auth-context/auth/infrastructure/guards/tenant/tenant.guard';
import { JwtStrategy } from '@/auth-context/auth/infrastructure/strategies/jwt/jwt.strategy';
import { AuthGraphQLMapper } from '@/auth-context/auth/transport/graphql/mappers/auth.mapper';
import { AuthMutationsResolver } from '@/auth-context/auth/transport/graphql/resolvers/auth-mutations.resolver';
import { AuthQueryResolver } from '@/auth-context/auth/transport/graphql/resolvers/auth-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

const RESOLVERS = [AuthQueryResolver, AuthMutationsResolver];

const SERVICES = [
  AssertAuthEmailExistsService,
  AssertAuthEmailNotExistsService,
  AssertAuthExistsService,
  AssertAuthViewModelExsistsService,
  JwtAuthService,
];

const QUERY_HANDLERS = [FindAuthsByCriteriaQueryHandler];

const COMMAND_HANDLERS = [
  AuthCreateCommandHandler,
  AuthDeleteCommandHandler,
  AuthLoginByEmailCommandHandler,
  AuthRefreshTokenCommandHandler,
  AuthRegisterByEmailCommandHandler,
];

const EVENT_HANDLERS = [
  AuthCreatedEventHandler,
  AuthLoggedInByEmailEventHandler,
  AuthRegisteredByEmailEventHandler,
  AuthUpdatedEventHandler,
];

const SAGAS = [AuthRegistrationSaga];

const FACTORIES = [AuthAggregateFactory, AuthViewModelFactory];

const MAPPERS = [AuthPrismaMapper, AuthMongoDBMapper, AuthGraphQLMapper];

const STRATEGIES = [JwtStrategy];

const GUARDS = [
  JwtAuthGuard,
  RolesGuard,
  OwnerGuard,
  TenantGuard,
  TenantRolesGuard,
];

const REPOSITORIES = [
  {
    provide: AUTH_WRITE_REPOSITORY_TOKEN,
    useClass: AuthPrismaRepository,
  },
  {
    provide: AUTH_READ_REPOSITORY_TOKEN,
    useClass: AuthMongoRepository,
  },
];

@Global()
@Module({
  imports: [
    SharedModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_ACCESS_SECRET') || 'access-secret',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRATION') ||
            '15m') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    ...RESOLVERS,
    ...SERVICES,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...EVENT_HANDLERS,
    ...SAGAS,
    ...REPOSITORIES,
    ...FACTORIES,
    ...MAPPERS,
    ...STRATEGIES,
    ...GUARDS,
  ],
  exports: [...SERVICES, ...GUARDS],
})
export class AuthModule {}
