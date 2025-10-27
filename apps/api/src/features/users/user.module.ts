import { UserDeleteCommandHandler } from '@/features/users/application/commands/delete-user/delete-user.command-handler';
import { UserCreateCommandHandler } from '@/features/users/application/commands/user-create/user-create.command-handler';
import { UserUpdateCommandHandler } from '@/features/users/application/commands/user-update/user-update.command-handler';
import { UserCreatedEventHandler } from '@/features/users/application/event-handlers/user-created/user-created.event-handler';
import { UserDeletedEventHandler } from '@/features/users/application/event-handlers/user-deleted/user-deleted.event-handler';
import { UserUpdatedEventHandler } from '@/features/users/application/event-handlers/user-updated/user-updated.event-handler';
import { FindUsersByCriteriaQueryHandler } from '@/features/users/application/queries/find-users-by-criteria/find-users-by-criteria.query-handler';
import { AssertUserExsistsService } from '@/features/users/application/services/assert-user-exsits/assert-user-exsits.service';
import { AssertUserUsernameIsUniqueService } from '@/features/users/application/services/assert-user-username-is-unique/assert-user-username-is-unique.service';
import { AssertUserViewModelExsistsService } from '@/features/users/application/services/assert-user-view-model-exsits/assert-user-view-model-exsits.service';
import {
  USER_AGGREGATE_FACTORY_TOKEN,
  UserAggregateFactory,
} from '@/features/users/domain/factories/user-aggregate.factory';
import {
  USER_VIEW_MODEL_FACTORY_TOKEN,
  UserViewModelFactory,
} from '@/features/users/domain/factories/user-view-model.factory';
import { USER_READ_REPOSITORY_TOKEN } from '@/features/users/domain/repositories/user-read.repository';
import { USER_WRITE_REPOSITORY_TOKEN } from '@/features/users/domain/repositories/user-write.repository';
import {
  USER_MONGODB_MAPPER_TOKEN,
  UserMongoDBMapper,
} from '@/features/users/infrastructure/database/mongodb/mappers/user-mongodb.mapper';
import { MongoUserRepository } from '@/features/users/infrastructure/database/mongodb/repositories/user-mongodb.repository';
import {
  USER_PRISMA_MAPPER_TOKEN,
  UserPrismaMapper,
} from '@/features/users/infrastructure/database/prisma/mappers/user-prisma.mapper';
import { PrismaUserRepository } from '@/features/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import {
  USER_GRAPHQL_MAPPER_TOKEN,
  UserGraphQLMapper,
} from '@/features/users/transport/graphql/mappers/user.mapper';
import { UserMutationsResolver } from '@/features/users/transport/graphql/resolvers/user-mutations.resolver';
import { UserQueryResolver } from '@/features/users/transport/graphql/resolvers/user-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const RESOLVERS = [UserQueryResolver, UserMutationsResolver];

const SERVICES = [
  AssertUserExsistsService,
  AssertUserUsernameIsUniqueService,
  AssertUserViewModelExsistsService,
];

const QUERY_HANDLERS = [FindUsersByCriteriaQueryHandler];

const COMMAND_HANDLERS = [
  UserCreateCommandHandler,
  UserUpdateCommandHandler,
  UserDeleteCommandHandler,
];

const EVENT_HANDLERS = [
  UserCreatedEventHandler,
  UserUpdatedEventHandler,
  UserDeletedEventHandler,
];

const FACTORIES = [
  {
    provide: USER_AGGREGATE_FACTORY_TOKEN,
    useClass: UserAggregateFactory,
  },
  {
    provide: USER_VIEW_MODEL_FACTORY_TOKEN,
    useClass: UserViewModelFactory,
  },
];

const MAPPERS = [
  {
    provide: USER_PRISMA_MAPPER_TOKEN,
    useClass: UserPrismaMapper,
  },
  {
    provide: USER_MONGODB_MAPPER_TOKEN,
    useClass: UserMongoDBMapper,
  },
  {
    provide: USER_GRAPHQL_MAPPER_TOKEN,
    useClass: UserGraphQLMapper,
  },
];

const REPOSITORIES = [
  {
    provide: USER_WRITE_REPOSITORY_TOKEN,
    useClass: PrismaUserRepository,
  },
  {
    provide: USER_READ_REPOSITORY_TOKEN,
    useClass: MongoUserRepository,
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
export class UserModule {}
