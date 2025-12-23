import { PasswordHashingService } from '@/auth-context/auth/application/services/password-hashing/password-hashing.service';
import { TypeOrmModule } from '@/shared/infrastructure/database/typeorm/typeorm.module';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Global, Module } from '@nestjs/common';
import { MongoModule } from './infrastructure/database/mongodb/mongodb.module';

const RESOLVERS = [];

const SERVICES = [PasswordHashingService, TenantContextService];

const QUERY_HANDLERS = [];

const COMMAND_HANDLERS = [];

const EVENT_HANDLERS = [];

const FACTORIES = [];

const MAPPERS = [MutationResponseGraphQLMapper];

const REPOSITORIES = [];

@Global()
@Module({
  imports: [MongoModule, TypeOrmModule],
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
    MongoModule,
    TypeOrmModule,
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
