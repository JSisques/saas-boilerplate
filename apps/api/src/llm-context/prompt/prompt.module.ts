import { PromptActivateCommandHandler } from '@/llm-context/prompt/application/commands/prompt-activate/prompt-activate.command-handler';
import { PromptArchiveCommandHandler } from '@/llm-context/prompt/application/commands/prompt-archive/prompt-archive.command-handler';
import { PromptCreateCommandHandler } from '@/llm-context/prompt/application/commands/prompt-create/prompt-create.command-handler';
import { PromptDeleteCommandHandler } from '@/llm-context/prompt/application/commands/prompt-delete/prompt-delete.command-handler';
import { PromptDeprecateCommandHandler } from '@/llm-context/prompt/application/commands/prompt-deprecate/prompt-deprecate.command-handler';
import { PromptDraftCommandHandler } from '@/llm-context/prompt/application/commands/prompt-draft/prompt-draft.command-handler';
import { PromptUpdateCommandHandler } from '@/llm-context/prompt/application/commands/prompt-update/prompt-update.command-handler';
import { PromptActivatedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-activated/prompt-activated.event-handler';
import { PromptArchivedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-archived/prompt-archived.event-handler';
import { PromptCreatedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-created/prompt-created.event-handler';
import { PromptDeletedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-deleted/prompt-deleted.event-handler';
import { PromptDeprecatedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-deprecated/prompt-deprecated.event-handler';
import { PromptDraftedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-drafted/prompt-drafted.event-handler';
import { PromptUpdatedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-updated/prompt-updated.event-handler';
import { PromptVersionIncrementedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-version-inncremented/prompt-version-inncremented.event-handler';
import { FindPromptsByCriteriaQueryHandler } from '@/llm-context/prompt/application/queries/prompt-find-by-criteria/prompt-find-by-criteria.query-handler';
import { FindPromptViewModelByIdQueryHandler } from '@/llm-context/prompt/application/queries/prompt-find-view-model-by-id/prompt-find-view-model-by-id.query-handler';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import { PromptAggregateFactory } from '@/llm-context/prompt/domain/factories/prompt-aggregate/prompt-aggregate.factory';
import { PromptViewModelFactory } from '@/llm-context/prompt/domain/factories/prompt-plan-view-model/prompt-view-model.factory';
import { PROMPT_READ_REPOSITORY_TOKEN } from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PROMPT_WRITE_REPOSITORY_TOKEN } from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { PromptMongoDBMapper } from '@/llm-context/prompt/infrastructure/database/mongodb/mappers/prompt-mongodb.mapper';
import { PromptMongoRepository } from '@/llm-context/prompt/infrastructure/database/mongodb/repositories/prompt-mongodb.repository';
import { PromptPrismaMapper } from '@/llm-context/prompt/infrastructure/database/prisma/mappers/prompt-prisma.mapper';
import { PromptPrismaRepository } from '@/llm-context/prompt/infrastructure/database/prisma/repositories/prompt-prisma.repository';
import { PromptGraphQLMapper } from '@/llm-context/prompt/transport/graphql/mappers/prompt.mapper';
import { PromptMutationsResolver } from '@/llm-context/prompt/transport/graphql/resolvers/prompt-mutations.resolver';
import { PromptQueryResolver } from '@/llm-context/prompt/transport/graphql/resolvers/prompt-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const RESOLVERS = [PromptQueryResolver, PromptMutationsResolver];

const SERVICES = [
  AssertPromptExsistsService,
  AssertPromptViewModelExsistsService,
];

const QUERY_HANDLERS = [
  FindPromptsByCriteriaQueryHandler,
  FindPromptViewModelByIdQueryHandler,
];

const COMMAND_HANDLERS = [
  PromptCreateCommandHandler,
  PromptUpdateCommandHandler,
  PromptDeleteCommandHandler,
  PromptActivateCommandHandler,
  PromptDraftCommandHandler,
  PromptArchiveCommandHandler,
  PromptDeprecateCommandHandler,
];

const EVENT_HANDLERS = [
  PromptCreatedEventHandler,
  PromptUpdatedEventHandler,
  PromptDeletedEventHandler,
  PromptActivatedEventHandler,
  PromptDraftedEventHandler,
  PromptArchivedEventHandler,
  PromptDeprecatedEventHandler,
  PromptVersionIncrementedEventHandler,
];

const FACTORIES = [PromptAggregateFactory, PromptViewModelFactory];

const MAPPERS = [PromptPrismaMapper, PromptMongoDBMapper, PromptGraphQLMapper];

const REPOSITORIES = [
  {
    provide: PROMPT_WRITE_REPOSITORY_TOKEN,
    useClass: PromptPrismaRepository,
  },
  {
    provide: PROMPT_READ_REPOSITORY_TOKEN,
    useClass: PromptMongoRepository,
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
export class PromptModule {}
