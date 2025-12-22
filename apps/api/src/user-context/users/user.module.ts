import { SharedModule } from '@/shared/shared.module';
import { UserDeleteCommandHandler } from '@/user-context/users/application/commands/delete-user/delete-user.command-handler';
import { UserCreateCommandHandler } from '@/user-context/users/application/commands/user-create/user-create.command-handler';
import { UserUpdateCommandHandler } from '@/user-context/users/application/commands/user-update/user-update.command-handler';
import { UserCreatedEventHandler } from '@/user-context/users/application/event-handlers/user-created/user-created.event-handler';
import { UserDeletedEventHandler } from '@/user-context/users/application/event-handlers/user-deleted/user-deleted.event-handler';
import { UserUpdatedEventHandler } from '@/user-context/users/application/event-handlers/user-updated/user-updated.event-handler';
import { FindUsersByCriteriaQueryHandler } from '@/user-context/users/application/queries/find-users-by-criteria/find-users-by-criteria.query-handler';
import { UserFindByIdQueryHandler } from '@/user-context/users/application/queries/user-find-by-id/user-find-by-id.query-handler';
import { UserViewModelFindByIdQueryHandler } from '@/user-context/users/application/queries/user-view-model-find-by-id/user-view-model-find-by-id.query-handler';
import { AssertUserExsistsService } from '@/user-context/users/application/services/assert-user-exsits/assert-user-exsits.service';
import { AssertUserUsernameIsUniqueService } from '@/user-context/users/application/services/assert-user-username-is-unique/assert-user-username-is-unique.service';
import { AssertUserViewModelExsistsService } from '@/user-context/users/application/services/assert-user-view-model-exsits/assert-user-view-model-exsits.service';
import { UserAggregateFactory } from '@/user-context/users/domain/factories/user-aggregate/user-aggregate.factory';
import { UserViewModelFactory } from '@/user-context/users/domain/factories/user-view-model/user-view-model.factory';
import { USER_READ_REPOSITORY_TOKEN } from '@/user-context/users/domain/repositories/user-read.repository';
import { USER_WRITE_REPOSITORY_TOKEN } from '@/user-context/users/domain/repositories/user-write.repository';
import { UserMongoDBMapper } from '@/user-context/users/infrastructure/database/mongodb/mappers/user-mongodb.mapper';
import { UserMongoRepository } from '@/user-context/users/infrastructure/database/mongodb/repositories/user-mongodb.repository';
import { UserTypeormEntity } from '@/user-context/users/infrastructure/database/typeorm/entities/user-typeorm.entity';
import { UserTypeOrmMapper } from '@/user-context/users/infrastructure/database/typeorm/mappers/user-typeorm.mapper';
import { UserTypeormRepository } from '@/user-context/users/infrastructure/database/typeorm/repositories/user-typeorm.repository';
import { UserGraphQLMapper } from '@/user-context/users/transport/graphql/mappers/user.mapper';
import { UserMutationsResolver } from '@/user-context/users/transport/graphql/resolvers/user-mutations.resolver';
import { UserQueryResolver } from '@/user-context/users/transport/graphql/resolvers/user-queries.resolver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const RESOLVERS = [UserQueryResolver, UserMutationsResolver];

const SERVICES = [
  AssertUserExsistsService,
  AssertUserUsernameIsUniqueService,
  AssertUserViewModelExsistsService,
];

const QUERY_HANDLERS = [
  FindUsersByCriteriaQueryHandler,
  UserFindByIdQueryHandler,
  UserViewModelFindByIdQueryHandler,
];

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

const FACTORIES = [UserAggregateFactory, UserViewModelFactory];

const MAPPERS = [UserTypeOrmMapper, UserMongoDBMapper, UserGraphQLMapper];

const REPOSITORIES = [
  {
    provide: USER_WRITE_REPOSITORY_TOKEN,
    useClass: UserTypeormRepository,
  },
  {
    provide: USER_READ_REPOSITORY_TOKEN,
    useClass: UserMongoRepository,
  },
];

const ENTITIES = [UserTypeormEntity];

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature(ENTITIES)],
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
