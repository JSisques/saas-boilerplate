import { HealthCheckQuery } from '@/health-context/health/application/queries/health-check/health-check.query';
import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { HealthViewModelFactory } from '@/health-context/health/domain/factories/health-view-model.factory';
import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HealthCheckService
  implements IBaseService<HealthCheckQuery, HealthViewModel>
{
  private readonly logger = new Logger(HealthCheckService.name);

  constructor(
    private readonly healthViewModelFactory: HealthViewModelFactory,
  ) {}

  /**
   * Executes the health check operation.
   *
   * Logs the health check process and returns a HealthViewModel
   * indicating the current status of the application.
   *
   * @returns {Promise<HealthViewModel>} The view model representing the health status.
   */
  async execute(): Promise<HealthViewModel> {
    this.logger.log('Checking health');

    return this.healthViewModelFactory.create({
      status: HealthStatusEnum.OK,
    });
  }
}
