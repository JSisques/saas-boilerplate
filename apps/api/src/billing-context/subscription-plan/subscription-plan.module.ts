import { SubscriptionPlanCreateCommandHandler } from '@/billing-context/subscription-plan/application/commands/subscription-plan-create/subscription-plan-create.command-handler';
import { SubscriptionPlanDeleteCommandHandler } from '@/billing-context/subscription-plan/application/commands/subscription-plan-delete/subscription-plan-delete.command-handler';
import { SubscriptionPlanUpdateCommandHandler } from '@/billing-context/subscription-plan/application/commands/subscription-plan-update/subscription-plan-update.command-handler';
import { SubscriptionPlanCreatedEventHandler } from '@/billing-context/subscription-plan/application/event-handlers/subscription-plan-created/subscription-plan-created.event-handler';
import { SubscriptionPlanDeletedEventHandler } from '@/billing-context/subscription-plan/application/event-handlers/subscription-plan-deleted/subscription-plan-deleted.event-handler';
import { SubscriptionPlanUpdatedEventHandler } from '@/billing-context/subscription-plan/application/event-handlers/subscription-plan-updated/subscription-plan-updated.event-handler';
import { FindSubscriptionPlansByCriteriaQueryHandler } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-by-criteria/subscription-plan-find-by-criteria.query-handler';
import { FindSubscriptionPlanByIdQueryHandler } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-by-id/subscription-plan-find-by-id.query-handler';
import { FindSubscriptionPlanViewModelByIdQueryHandler } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-view-model-by-id/subscription-plan-find-view-model-by-id.query-handler';
import { AssertSubscriptionPlanExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-exsits/assert-subscription-plan-exsits.service';
import { AssertSubscriptionPlanSlugIsUniqueService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-slug-is-unique/assert-subscription-plan-slug-is-unique.service';
import { AssertSubscriptionPlanViewModelExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-view-model-exsits/assert-subscription-plan-view-model-exsits.service';
import { SubscriptionPlanAggregateFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-aggregate/subscription-plan-aggregate.factory';
import { SubscriptionPlanViewModelFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-view-model/subscription-plan-view-model.factory';
import { SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN } from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN } from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { SubscriptionPlanMongoDBMapper } from '@/billing-context/subscription-plan/infrastructure/database/mongodb/mappers/subscription-plan-mongodb.mapper';
import { SubscriptionPlanMongoRepository } from '@/billing-context/subscription-plan/infrastructure/database/mongodb/repositories/subscription-plan-mongodb.repository';
import { SubscriptionPlanPrismaMapper } from '@/billing-context/subscription-plan/infrastructure/database/prisma/mappers/subscription-plan-prisma.mapper';
import { SubscriptionPlanPrismaRepository } from '@/billing-context/subscription-plan/infrastructure/database/prisma/repositories/subscription-plan-prisma.repository';
import { SubscriptionPlanGraphQLMapper } from '@/billing-context/subscription-plan/transport/graphql/mappers/subscription-plan.mapper';
import { SubscriptionPlanMutationsResolver } from '@/billing-context/subscription-plan/transport/graphql/resolvers/subscription-plan-mutations.resolver';
import { SubscriptionPlanQueryResolver } from '@/billing-context/subscription-plan/transport/graphql/resolvers/subscription-plan-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const RESOLVERS = [
  SubscriptionPlanQueryResolver,
  SubscriptionPlanMutationsResolver,
];

const SERVICES = [
  AssertSubscriptionPlanExsistsService,
  AssertSubscriptionPlanSlugIsUniqueService,
  AssertSubscriptionPlanViewModelExsistsService,
];

const QUERY_HANDLERS = [
  FindSubscriptionPlansByCriteriaQueryHandler,
  FindSubscriptionPlanByIdQueryHandler,
  FindSubscriptionPlanViewModelByIdQueryHandler,
];

const COMMAND_HANDLERS = [
  SubscriptionPlanCreateCommandHandler,
  SubscriptionPlanUpdateCommandHandler,
  SubscriptionPlanDeleteCommandHandler,
];

const EVENT_HANDLERS = [
  SubscriptionPlanCreatedEventHandler,
  SubscriptionPlanUpdatedEventHandler,
  SubscriptionPlanDeletedEventHandler,
];

const FACTORIES = [
  SubscriptionPlanAggregateFactory,
  SubscriptionPlanViewModelFactory,
];

const MAPPERS = [
  SubscriptionPlanPrismaMapper,
  SubscriptionPlanMongoDBMapper,
  SubscriptionPlanGraphQLMapper,
];

const REPOSITORIES = [
  {
    provide: SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN,
    useClass: SubscriptionPlanPrismaRepository,
  },
  {
    provide: SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN,
    useClass: SubscriptionPlanMongoRepository,
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
export class SubscriptionPlanModule {}
