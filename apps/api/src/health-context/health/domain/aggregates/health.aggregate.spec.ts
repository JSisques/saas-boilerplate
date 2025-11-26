import { HealthAggregate } from '@/health-context/health/domain/aggregates/health.aggregate';
import { IHealthCreateDto } from '@/health-context/health/domain/dtos/entities/health-create/health-create.dto';
import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { HealthStatusValueObject } from '@/health-context/health/domain/value-objects/health-status/health-status.vo';

describe('HealthAggregate', () => {
  const createDto = (
    status: HealthStatusEnum = HealthStatusEnum.OK,
    writeDatabaseStatus: HealthStatusEnum = HealthStatusEnum.OK,
    readDatabaseStatus: HealthStatusEnum = HealthStatusEnum.OK,
  ): IHealthCreateDto => ({
    status: new HealthStatusValueObject(status),
    writeDatabaseStatus: new HealthStatusValueObject(writeDatabaseStatus),
    readDatabaseStatus: new HealthStatusValueObject(readDatabaseStatus),
  });

  it('should expose status value object via getter', () => {
    const dto = createDto(
      HealthStatusEnum.OK,
      HealthStatusEnum.OK,
      HealthStatusEnum.OK,
    );
    const aggregate = new HealthAggregate(dto);
    expect(aggregate.status).toBeInstanceOf(HealthStatusValueObject);
    expect(aggregate.status.value).toBe(HealthStatusEnum.OK);
    expect(aggregate.writeDatabaseStatus).toBeInstanceOf(
      HealthStatusValueObject,
    );
    expect(aggregate.writeDatabaseStatus.value).toBe(HealthStatusEnum.OK);
    expect(aggregate.readDatabaseStatus).toBeInstanceOf(
      HealthStatusValueObject,
    );
    expect(aggregate.readDatabaseStatus.value).toBe(HealthStatusEnum.OK);
  });
});
