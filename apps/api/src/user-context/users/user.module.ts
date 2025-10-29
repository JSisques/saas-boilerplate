import { SharedModule } from '@/shared/shared.module';
import { UserDeleteCommandHandler } from '@/user-context/users/application/commands/delete-user/delete-user.command-handler';
import { UserCreateCommandHandler } from '@/user-context/users/application/commands/user-create/user-create.command-handler';
import { UserUpdateCommandHandler } from '@/user-context/users/application/commands/user-update/user-update.command-handler';
import { UserCreatedEventHandler } from '@/user-context/users/application/event-handlers/user-created/user-created.event-handler';
import { UserDeletedEventHandler } from '@/user-context/users/application/event-handlers/user-deleted/user-deleted.event-handler';
import { UserUpdatedEventHandler } from '@/user-context/users/application/event-handlers/user-updated/user-updated.event-handler';
import { FindUsersByCriteriaQueryHandler } from '@/user-context/users/application/queries/find-users-by-criteria/find-users-by-criteria.query-handler';
import { AssertUserExsistsService } from '@/user-context/users/application/services/assert-user-exsits/assert-user-exsits.service';
import { AssertUserUsernameIsUniqueService } from '@/user-context/users/application/services/assert-user-username-is-unique/assert-user-username-is-unique.service';
import { AssertUserViewModelExsistsService } from '@/user-context/users/application/services/assert-user-view-model-exsits/assert-user-view-model-exsits.service';
import {
  USER_AGGREGATE_FACTORY_TOKEN,
  UserAggregateFactory,
} from '@/user-context/users/domain/factories/user-aggregate.factory';
import {
  USER_VIEW_MODEL_FACTORY_TOKEN,
  UserViewModelFactory,
} from '@/user-context/users/domain/factories/user-view-model.factory';
import { USER_READ_REPOSITORY_TOKEN } from '@/user-context/users/domain/repositories/user-read.repository';
import { USER_WRITE_REPOSITORY_TOKEN } from '@/user-context/users/domain/repositories/user-write.repository';
import {
  USER_MONGODB_MAPPER_TOKEN,
  UserMongoDBMapper,
} from '@/user-context/users/infrastructure/database/mongodb/mappers/user-mongodb.mapper';
import { MongoUserRepository } from '@/user-context/users/infrastructure/database/mongodb/repositories/user-mongodb.repository';
import {
  USER_PRISMA_MAPPER_TOKEN,
  UserPrismaMapper,
} from '@/user-context/users/infrastructure/database/prisma/mappers/user-prisma.mapper';
import { PrismaUserRepository } from '@/user-context/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import {
  USER_GRAPHQL_MAPPER_TOKEN,
  UserGraphQLMapper,
} from '@/user-context/users/transport/graphql/mappers/user.mapper';
import { UserMutationsResolver } from '@/user-context/users/transport/graphql/resolvers/user-mutations.resolver';
import { UserQueryResolver } from '@/user-context/users/transport/graphql/resolvers/user-queries.resolver';
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
