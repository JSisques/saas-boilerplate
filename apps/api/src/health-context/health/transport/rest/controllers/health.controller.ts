import { HealthCheckService } from '@/health-context/health/application/services/health-check/health-check.service';
import { HealthRestMapper } from '@/health-context/health/transport/rest/mappers/health-rest.mapper';
import { Controller, Get, Logger } from '@nestjs/common';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly healthRestMapper: HealthRestMapper,
  ) {}

  @Get()
  async healthCheck() {
    this.logger.log('Checking health');
    const result = await this.healthCheckService.execute();
    return this.healthRestMapper.toResponseDto(result);
  }
}
