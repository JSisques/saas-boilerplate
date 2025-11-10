import { HealthAggregate } from '@/health-context/health/domain/aggregates/health.aggregate';
import { IHealthCreateDto } from '@/health-context/health/domain/dtos/entities/health-create/health-create.dto';
import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { HealthStatusValueObject } from '@/health-context/health/domain/value-objects/health-status/health-status.vo';

describe('HealthAggregate', () => {
  const createDto = (
    status: HealthStatusEnum = HealthStatusEnum.OK,
  ): IHealthCreateDto => ({
    status: new HealthStatusValueObject(status),
  });

  it('should expose status value object via getter', () => {
    const dto = createDto();

    const aggregate = new HealthAggregate(dto);

    expect(aggregate.status).toBeInstanceOf(HealthStatusValueObject);
    expect(aggregate.status.value).toBe(HealthStatusEnum.OK);
  });

  it('should convert to primitives', () => {
    const dto = createDto(HealthStatusEnum.WARNING);

    const aggregate = new HealthAggregate(dto);
    const primitives = aggregate.toPrimitives();

    expect(primitives).toEqual({
      status: HealthStatusEnum.WARNING,
    });
  });
});
