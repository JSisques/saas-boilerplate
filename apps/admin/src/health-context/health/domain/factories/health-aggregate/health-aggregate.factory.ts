import { HealthAggregate } from '@/health-context/health/domain/aggregates/health.aggregate';
import { IHealthCreateDto } from '@/health-context/health/domain/dtos/entities/health-create/health-create.dto';
import { HealthPrimitives } from '@/health-context/health/domain/primitives/health.primitives';
import { HealthStatusValueObject } from '@/health-context/health/domain/value-objects/health-status/health-status.vo';
import { IWriteFactory } from '@repo/shared/domain/interfaces/write-factory.interface';

/**
 * Factory class responsible for creating HealthAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate health information.
 */
export class HealthAggregateFactory
  implements IWriteFactory<HealthAggregate, IHealthCreateDto>
{
  /**
   * Creates a new HealthAggregate entity using the provided properties.
   *
   * @param data - The health create data.
   * @returns {HealthAggregate} - The created health aggregate entity.
   */
  public create(data: IHealthCreateDto): HealthAggregate {
    return new HealthAggregate(data);
  }

  /**
   * Creates a new HealthAggregate entity from primitive data.
   *
   * @param data - The health primitive data.
   * @returns The created health aggregate entity.
   */
  public fromPrimitives(data: HealthPrimitives): HealthAggregate {
    return new HealthAggregate({
      status: new HealthStatusValueObject(data.status),
      writeDatabaseStatus: new HealthStatusValueObject(
        data.writeDatabaseStatus,
      ),
      readDatabaseStatus: new HealthStatusValueObject(data.readDatabaseStatus),
    });
  }
}
