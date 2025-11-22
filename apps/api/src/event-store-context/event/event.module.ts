import { EventReplayCommandHandler } from '@/event-store-context/event/application/commands/event-replay/event-replay.command-handler';
import { EventCreatedEventHandler } from '@/event-store-context/event/application/event-handlers/event/event-created/event-created.event-handler';
import { GlobalEventTrackingListener } from '@/event-store-context/event/application/event-listeners/global-event-tracking/global-event-tracking.listener';
import { FindEventsByCriteriaQueryHandler } from '@/event-store-context/event/application/queries/event-find-by-criteria/event-find-by-criteria.command-handler';
import { EventPublishService } from '@/event-store-context/event/application/services/event-publish/event-publish.service';
import { EventReplayService } from '@/event-store-context/event/application/services/event-replay/event-replay.service';
import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { EventAggregateFactory } from '@/event-store-context/event/domain/factories/event-aggregate/event-aggregate.factory';
import { DomainEventFactory } from '@/event-store-context/event/domain/factories/event-domain/event-domain.factory';
import { EventViewModelFactory } from '@/event-store-context/event/domain/factories/event-view-model/event-view-model.factory';
import { EVENT_READ_REPOSITORY_TOKEN } from '@/event-store-context/event/domain/repositories/event-read.repository';
import { EVENT_WRITE_REPOSITORY_TOKEN } from '@/event-store-context/event/domain/repositories/event-write.repository';
import { EventMongoMapper } from '@/event-store-context/event/infrastructure/mongodb/mappers/event-mongodb.mapper';
import { EventMongoRepository } from '@/event-store-context/event/infrastructure/mongodb/repositories/event-mongodb.repository';
import { EventPrismaMapper } from '@/event-store-context/event/infrastructure/prisma/mappers/event-prisma.mapper';
import { EventPrismaRepository } from '@/event-store-context/event/infrastructure/prisma/repositories/event-prisma.repository';
import { EventGraphQLMapper } from '@/event-store-context/event/transport/graphql/mappers/event.mapper';
import { EventMutationResolver } from '@/event-store-context/event/transport/graphql/resolvers/event-mutations/event-mutations.resolver';
import { EventQueryResolver } from '@/event-store-context/event/transport/graphql/resolvers/event-queries/event-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const RESOLVERS = [EventQueryResolver, EventMutationResolver];

const SERVICES = [
  EventTrackingService,
  EventReplayService,
  EventPublishService,
];

const QUERY_HANDLERS = [FindEventsByCriteriaQueryHandler];

const COMMAND_HANDLERS = [EventReplayCommandHandler];

const EVENT_HANDLERS = [EventCreatedEventHandler];

const EVENT_SUBSCRIBERS = [GlobalEventTrackingListener];

const FACTORIES = [
  EventAggregateFactory,
  EventViewModelFactory,
  DomainEventFactory,
];

const MAPPERS = [EventPrismaMapper, EventMongoMapper, EventGraphQLMapper];

const REPOSITORIES = [
  {
    provide: EVENT_WRITE_REPOSITORY_TOKEN,
    useClass: EventPrismaRepository,
  },
  {
    provide: EVENT_READ_REPOSITORY_TOKEN,
    useClass: EventMongoRepository,
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
    ...EVENT_SUBSCRIBERS,
    ...REPOSITORIES,
    ...FACTORIES,
    ...MAPPERS,
  ],
})
export class EventModule {}
