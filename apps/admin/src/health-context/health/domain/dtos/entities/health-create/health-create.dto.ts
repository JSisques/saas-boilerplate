import { HealthStatusValueObject } from '@/health-context/health/domain/value-objects/health-status/health-status.vo';

export interface IHealthCreateDto {
  status: HealthStatusValueObject;
  writeDatabaseStatus: HealthStatusValueObject;
  readDatabaseStatus: HealthStatusValueObject;
}
