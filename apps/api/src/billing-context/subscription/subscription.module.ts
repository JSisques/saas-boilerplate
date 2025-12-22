import { SubscriptionActivateCommandHandler } from '@/billing-context/subscription/application/commands/subscription-activate/subscription-activate.command-handler';
import { SubscriptionCancelCommandHandler } from '@/billing-context/subscription/application/commands/subscription-cancel/subscription-cancel.command-handler';
import { SubscriptionCreateCommandHandler } from '@/billing-context/subscription/application/commands/subscription-create/subscription-create.command-handler';
import { SubscriptionDeactivateCommandHandler } from '@/billing-context/subscription/application/commands/subscription-deactivate/subscription-deactivate.command-handler';
import { SubscriptionDeleteCommandHandler } from '@/billing-context/subscription/application/commands/subscription-delete/subscription-delete.command-handler';
import { SubscriptionRefundCommandHandler } from '@/billing-context/subscription/application/commands/subscription-refund/subscription-refund.command-handler';
import { SubscriptionUpdateCommandHandler } from '@/billing-context/subscription/application/commands/subscription-update/subscription-update.command-handler';
import { SubscriptionActivatedEventHandler } from '@/billing-context/subscription/application/event-handlers/subscription-activated/subscription-activated.event-handler';
import { SubscriptionCancelledEventHandler } from '@/billing-context/subscription/application/event-handlers/subscription-cencelled/subscription-cancelled.event-handler';
import { SubscriptionCreatedEventHandler } from '@/billing-context/subscription/application/event-handlers/subscription-created/subscription-created.event-handler';
import { SubscriptionDeactivatedEventHandler } from '@/billing-context/subscription/application/event-handlers/subscription-deactivated/subscription-deactivated.event-handler';
import { SubscriptionDeletedEventHandler } from '@/billing-context/subscription/application/event-handlers/subscription-deleted/subscription-deleted.event-handler';
import { SubscriptionRefundedEventHandler } from '@/billing-context/subscription/application/event-handlers/subscription-refunded/subscription-refunded.event-handler';
import { SubscriptionUpdatedEventHandler } from '@/billing-context/subscription/application/event-handlers/subscription-updated/subscription-updated.event-handler';
import { FindSubscriptionsByCriteriaQueryHandler } from '@/billing-context/subscription/application/queries/subscription-find-by-criteria/subscription-find-by-criteria.query-handler';
import { FindSubscriptionViewModelByIdQueryHandler } from '@/billing-context/subscription/application/queries/subscription-find-view-model-by-id/subscription-find-view-model-by-id.query-handler';
import { FindSubscriptionViewModelByTenantIdQueryHandler } from '@/billing-context/subscription/application/queries/subscription-find-view-model-by-tenant-id copy/subscription-find-view-model-by-tenant-id.query-handler';
import { AssertSubscriptionExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-exsits/assert-subscription-exsits.service';
import { AssertSubscriptionTenantIdNotExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-tenant-id-not-exsists/assert-subscription-tenant-id-not-exsists.service';
import { AssertSubscriptionViewModelExsistsService } from '@/billing-context/subscription/application/services/assert-subscription-view-model-exsits/assert-subscription-view-model-exsits.service';
import { SubscriptionAggregateFactory } from '@/billing-context/subscription/domain/factories/subscription-aggregate/subscription-aggregate.factory';
import { SubscriptionViewModelFactory } from '@/billing-context/subscription/domain/factories/subscription-plan-view-model/subscription-view-model.factory';
import { SUBSCRIPTION_READ_REPOSITORY_TOKEN } from '@/billing-context/subscription/domain/repositories/subscription-read/subscription-read.repository';
import { SUBSCRIPTION_WRITE_REPOSITORY_TOKEN } from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { SubscriptionMongoDBMapper } from '@/billing-context/subscription/infrastructure/database/mongodb/mappers/subscription-mongodb.mapper';
import { SubscriptionMongoRepository } from '@/billing-context/subscription/infrastructure/database/mongodb/repositories/subscription-mongodb.repository';
import { SubscriptionTypeormEntity } from '@/billing-context/subscription/infrastructure/database/typeorm/entities/subscription-typeorm.entity';
import { SubscriptionTypeormMapper } from '@/billing-context/subscription/infrastructure/database/typeorm/mappers/subscription-typeorm.mapper';
import { SubscriptionTypeormRepository } from '@/billing-context/subscription/infrastructure/database/typeorm/repositories/subscription-typeorm.repository';
import { SubscriptionGraphQLMapper } from '@/billing-context/subscription/transport/graphql/mappers/subscription.mapper';
import { SubscriptionMutationsResolver } from '@/billing-context/subscription/transport/graphql/resolvers/subscription-mutations.resolver';
import { SubscriptionQueryResolver } from '@/billing-context/subscription/transport/graphql/resolvers/subscription-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const RESOLVERS = [SubscriptionQueryResolver, SubscriptionMutationsResolver];

const SERVICES = [
  AssertSubscriptionExsistsService,
  AssertSubscriptionViewModelExsistsService,
  AssertSubscriptionTenantIdNotExsistsService,
];

const QUERY_HANDLERS = [
  FindSubscriptionsByCriteriaQueryHandler,
  FindSubscriptionViewModelByIdQueryHandler,
  FindSubscriptionViewModelByTenantIdQueryHandler,
];

const COMMAND_HANDLERS = [
  SubscriptionCreateCommandHandler,
  SubscriptionUpdateCommandHandler,
  SubscriptionDeleteCommandHandler,
  SubscriptionActivateCommandHandler,
  SubscriptionDeactivateCommandHandler,
  SubscriptionCancelCommandHandler,
  SubscriptionRefundCommandHandler,
];

const EVENT_HANDLERS = [
  SubscriptionCreatedEventHandler,
  SubscriptionUpdatedEventHandler,
  SubscriptionDeletedEventHandler,
  SubscriptionActivatedEventHandler,
  SubscriptionDeactivatedEventHandler,
  SubscriptionCancelledEventHandler,
  SubscriptionRefundedEventHandler,
];

const FACTORIES = [SubscriptionAggregateFactory, SubscriptionViewModelFactory];

const MAPPERS = [
  SubscriptionTypeormMapper,
  SubscriptionMongoDBMapper,
  SubscriptionGraphQLMapper,
];

const REPOSITORIES = [
  {
    provide: SUBSCRIPTION_WRITE_REPOSITORY_TOKEN,
    useClass: SubscriptionTypeormRepository,
  },
  {
    provide: SUBSCRIPTION_READ_REPOSITORY_TOKEN,
    useClass: SubscriptionMongoRepository,
  },
];

const ENTITIES = [SubscriptionTypeormEntity];

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
export class SubscriptionModule {}
