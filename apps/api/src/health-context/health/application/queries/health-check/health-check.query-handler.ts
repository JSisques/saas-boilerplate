import { HealthCheckQuery } from '@/health-context/health/application/queries/health-check/health-check.query';
import { HealthCheckService } from '@/health-context/health/application/services/health-check/health-check.service';
import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(HealthCheckQuery)
export class HealthCheckQueryHandler
  implements IQueryHandler<HealthCheckQuery>
{
  private readonly logger = new Logger(HealthCheckQueryHandler.name);

  constructor(private readonly healthCheckService: HealthCheckService) {}

  async execute(): Promise<HealthViewModel> {
    this.logger.log('Executing health check query');
    return await this.healthCheckService.execute();
  }
}
