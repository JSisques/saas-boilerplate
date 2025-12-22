import { FeatureChangeStatusCommandHandler } from '@/feature-context/features/application/commands/feature-change-status/feature-change-status.command-handler';
import { FeatureCreateCommandHandler } from '@/feature-context/features/application/commands/feature-create/feature-create.command-handler';
import { FeatureDeleteCommandHandler } from '@/feature-context/features/application/commands/feature-delete/feature-delete.command-handler';
import { FeatureUpdateCommandHandler } from '@/feature-context/features/application/commands/feature-update/feature-update.command-handler';
import { FeatureCreatedEventHandler } from '@/feature-context/features/application/event-handlers/feature-created/feature-created.event-handler';
import { FeatureDeletedEventHandler } from '@/feature-context/features/application/event-handlers/feature-deleted/feature-deleted.event-handler';
import { FeatureStatusChangedEventHandler } from '@/feature-context/features/application/event-handlers/feature-status-changed/feature-status-changed.event-handler';
import { FeatureUpdatedEventHandler } from '@/feature-context/features/application/event-handlers/feature-updated/feature-updated.event-handler';
import { FeatureViewModelFindByIdQueryHandler } from '@/feature-context/features/application/queries/feature-view-model-find-by-id/feature-view-model-find-by-id.query-handler';
import { FindFeatureByIdQueryHandler } from '@/feature-context/features/application/queries/find-feature-by-id/find-feature-by-id.query-handler';
import { FindFeaturesByCriteriaQueryHandler } from '@/feature-context/features/application/queries/find-features-by-criteria/find-features-by-criteria.query-handler';
import { AssertFeatureExistsService } from '@/feature-context/features/application/services/assert-feature-exists/assert-feature-exists.service';
import { AssertFeatureViewModelExistsService } from '@/feature-context/features/application/services/assert-feature-view-model-exists/assert-feature-view-model-exists.service';
import { FeatureAggregateFactory } from '@/feature-context/features/domain/factories/feature-aggregate/feature-aggregate.factory';
import { FeatureViewModelFactory } from '@/feature-context/features/domain/factories/feature-view-model/feature-view-model.factory';
import { FEATURE_READ_REPOSITORY_TOKEN } from '@/feature-context/features/domain/repositories/feature-read.repository';
import { FEATURE_WRITE_REPOSITORY_TOKEN } from '@/feature-context/features/domain/repositories/feature-write.repository';
import { FeatureMongoDBMapper } from '@/feature-context/features/infrastructure/database/mongodb/mappers/feature-mongodb.mapper';
import { FeatureMongoRepository } from '@/feature-context/features/infrastructure/database/mongodb/repositories/feature-mongodb.repository';
import { FeatureTypeormEntity } from '@/feature-context/features/infrastructure/database/typeorm/entities/feature-typeorm.entity';
import { FeatureTypeormMapper } from '@/feature-context/features/infrastructure/database/typeorm/mappers/feature-typeorm.mapper';
import { FeatureTypeormRepository } from '@/feature-context/features/infrastructure/database/typeorm/repositories/feature-typeorm.repository';
import { FeatureGraphQLMapper } from '@/feature-context/features/transport/graphql/mappers/feature.mapper';
import { FeatureMutationsResolver } from '@/feature-context/features/transport/graphql/resolvers/feature-mutations.resolver';
import { FeatureQueriesResolver } from '@/feature-context/features/transport/graphql/resolvers/feature-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const RESOLVERS = [FeatureQueriesResolver, FeatureMutationsResolver];

const SERVICES = [
  AssertFeatureExistsService,
  AssertFeatureViewModelExistsService,
];

const QUERY_HANDLERS = [
  FindFeaturesByCriteriaQueryHandler,
  FindFeatureByIdQueryHandler,
  FeatureViewModelFindByIdQueryHandler,
];

const COMMAND_HANDLERS = [
  FeatureCreateCommandHandler,
  FeatureUpdateCommandHandler,
  FeatureDeleteCommandHandler,
  FeatureChangeStatusCommandHandler,
];

const EVENT_HANDLERS = [
  FeatureCreatedEventHandler,
  FeatureUpdatedEventHandler,
  FeatureDeletedEventHandler,
  FeatureStatusChangedEventHandler,
];

const FACTORIES = [FeatureAggregateFactory, FeatureViewModelFactory];

const MAPPERS = [
  FeatureTypeormMapper,
  FeatureMongoDBMapper,
  FeatureGraphQLMapper,
];

const REPOSITORIES = [
  {
    provide: FEATURE_WRITE_REPOSITORY_TOKEN,
    useClass: FeatureTypeormRepository,
  },
  {
    provide: FEATURE_READ_REPOSITORY_TOKEN,
    useClass: FeatureMongoRepository,
  },
];

const ENTITIES = [FeatureTypeormEntity];
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
export class FeaturesModule {}
