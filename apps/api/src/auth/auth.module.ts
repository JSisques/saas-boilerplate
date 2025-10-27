import { AuthLoginByEmailCommandHandler } from '@/auth/application/commands/auth-login-by-email/auth-login-by-email.command-handler';
import { AuthRegisterByEmailCommandHandler } from '@/auth/application/commands/auth-register-by-email/auth-register-by-email.command-handler';
import { AuthLoggedInByEmailEventHandler } from '@/auth/application/event-handlers/auth-logged-in-by-email/auth-logged-in-by-email.event-handler';
import { AuthRegisteredByEmailEventHandler } from '@/auth/application/event-handlers/auth-registered-by-email/auth-registered-by-email.event-handler';
import { FindAuthsByCriteriaQueryHandler } from '@/auth/application/queries/find-auths-by-criteria/find-auths-by-criteria.query-handler';
import { AssertAuthEmailExistsService } from '@/auth/application/services/assert-auth-email-exists/assert-auth-email-exists.service';
import { AssertAuthEmailNotExistsService } from '@/auth/application/services/assert-auth-email-not-exists/assert-auth-email-not-exists.service';
import { AssertAuthExistsService } from '@/auth/application/services/assert-auth-exsists/assert-auth-exsists.service';
import { AssertAuthViewModelExsistsService } from '@/auth/application/services/assert-auth-view-model-exsists/assert-auth-view-model-exsists.service';
import {
  AUTH_AGGREGATE_FACTORY_TOKEN,
  AuthAggregateFactory,
} from '@/auth/domain/factories/auth-aggregate.factory';
import {
  AUTH_VIEW_MODEL_FACTORY_TOKEN,
  AuthViewModelFactory,
} from '@/auth/domain/factories/auth-view-model.factory';
import { AUTH_READ_REPOSITORY_TOKEN } from '@/auth/domain/repositories/auth-read.repository';
import { AUTH_WRITE_REPOSITORY_TOKEN } from '@/auth/domain/repositories/auth-write.repository';
import {
  AUTH_MONGODB_MAPPER_TOKEN,
  AuthMongoDBMapper,
} from '@/auth/infrastructure/database/mongodb/mappers/auth-mongodb.mapper';
import { AuthMongoRepository } from '@/auth/infrastructure/database/mongodb/repositories/auth-mongodb.repository';
import {
  AUTH_PRISMA_MAPPER_TOKEN,
  AuthPrismaMapper,
} from '@/auth/infrastructure/database/prisma/mappers/auth-prisma.mapper';
import { AuthPrismaRepository } from '@/auth/infrastructure/database/prisma/repositories/auth-prisma.repository';
import {
  AUTH_GRAPHQL_MAPPER_TOKEN,
  AuthGraphQLMapper,
} from '@/auth/transport/graphql/mappers/auth.mapper';
import { AuthMutationsResolver } from '@/auth/transport/graphql/resolvers/auth-mutations.resolver';
import { AuthQueryResolver } from '@/auth/transport/graphql/resolvers/auth-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const RESOLVERS = [AuthQueryResolver, AuthMutationsResolver];

const SERVICES = [
  AssertAuthEmailExistsService,
  AssertAuthEmailNotExistsService,
  AssertAuthExistsService,
  AssertAuthViewModelExsistsService,
];

const QUERY_HANDLERS = [FindAuthsByCriteriaQueryHandler];

const COMMAND_HANDLERS = [
  AuthLoginByEmailCommandHandler,
  AuthRegisterByEmailCommandHandler,
];

const EVENT_HANDLERS = [
  AuthLoggedInByEmailEventHandler,
  AuthRegisteredByEmailEventHandler,
];

const FACTORIES = [
  {
    provide: AUTH_AGGREGATE_FACTORY_TOKEN,
    useClass: AuthAggregateFactory,
  },
  {
    provide: AUTH_VIEW_MODEL_FACTORY_TOKEN,
    useClass: AuthViewModelFactory,
  },
];

const MAPPERS = [
  {
    provide: AUTH_PRISMA_MAPPER_TOKEN,
    useClass: AuthPrismaMapper,
  },
  {
    provide: AUTH_MONGODB_MAPPER_TOKEN,
    useClass: AuthMongoDBMapper,
  },
  {
    provide: AUTH_GRAPHQL_MAPPER_TOKEN,
    useClass: AuthGraphQLMapper,
  },
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

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [
    ...RESOLVERS,
    ...SERVICES,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...EVENT_HANDLERS,
    ...REPOSITORIES,
    ...FACTORIES,
    ...MAPPERS,
  ],
})
export class AuthModule {}
