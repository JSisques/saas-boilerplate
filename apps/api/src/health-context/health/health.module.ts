import { HealthCheckQueryHandler } from '@/health-context/health/application/queries/health-check/health-check.query-handler';
import { HealthCheckService } from '@/health-context/health/application/services/health-check/health-check.service';
import { HealthViewModelFactory } from '@/health-context/health/domain/factories/health-view-model.factory';
import { HealthGraphQLMapper } from '@/health-context/health/transport/graphql/mappers/health.mapper';
import { HealthQueryResolver } from '@/health-context/health/transport/graphql/resolvers/health-queries.resolver';
import { HealthController } from '@/health-context/health/transport/rest/controllers/health.controller';
import { HealthRestMapper } from '@/health-context/health/transport/rest/mappers/health-rest.mapper';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const RESOLVERS = [HealthQueryResolver];

const SERVICES = [HealthCheckService];

const QUERY_HANDLERS = [HealthCheckQueryHandler];

const COMMAND_HANDLERS = [];

const EVENT_HANDLERS = [];

const FACTORIES = [HealthViewModelFactory];

const MAPPERS = [HealthGraphQLMapper, HealthRestMapper];

const REPOSITORIES = [];

const CONTROLLERS = [HealthController];

@Module({
  imports: [SharedModule],
  controllers: [...CONTROLLERS],
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
export class HealthModule {}
