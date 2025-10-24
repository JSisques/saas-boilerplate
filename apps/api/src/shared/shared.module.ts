import {
  MUTATION_RESPONSE_GRAPHQL_MAPPER_TOKEN,
  MutationResponseGraphQLMapper,
} from '@/shared/transport/graphql/mappers/mutation-response.mapper';
import { Global, Module } from '@nestjs/common';
import { MongoModule } from './infrastructure/database/mongodb/mongodb.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';

const RESOLVERS = [];

const SERVICES = [];

const QUERY_HANDLERS = [];

const COMMAND_HANDLERS = [];

const EVENT_HANDLERS = [];

const FACTORIES = [];

const MAPPERS = [
  {
    provide: MUTATION_RESPONSE_GRAPHQL_MAPPER_TOKEN,
    useClass: MutationResponseGraphQLMapper,
  },
];

const REPOSITORIES = [];

@Global()
@Module({
  imports: [PrismaModule, MongoModule],
  controllers: [],
  providers: [
    ...RESOLVERS,
    ...SERVICES,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...EVENT_HANDLERS,
    ...FACTORIES,
    ...MAPPERS,
    ...REPOSITORIES,
  ],
  exports: [
    PrismaModule,
    MongoModule,
    ...RESOLVERS,
    ...SERVICES,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...EVENT_HANDLERS,
    ...FACTORIES,
    ...MAPPERS,
    ...REPOSITORIES,
  ],
})
export class SharedModule {}
