import { HealthAggregate } from '@/health-context/health/domain/aggregates/health.aggregate';
import { IHealthCreateViewModelDto } from '@/health-context/health/domain/dtos/view-models/health-create/health-create.dto';
import { HealthPrimitives } from '@/health-context/health/domain/primitives/health.primitives';
import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HealthViewModelFactory
  implements IReadFactory<HealthViewModel, IHealthCreateViewModelDto>
{
  private readonly logger = new Logger(HealthViewModelFactory.name);

  /**
   * Creates a new health view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: IHealthCreateViewModelDto): HealthViewModel {
    this.logger.log(
      `Creating health view model from DTO: ${JSON.stringify(data)}`,
    );
    return new HealthViewModel(data);
  }

  public fromAggregate(source: HealthAggregate): HealthViewModel {
    this.logger.log(`Creating health view model from aggregate: ${source}`);
    return new HealthViewModel({
      status: source.status.value,
    });
  }
  public fromPrimitives(primitives: HealthPrimitives): HealthViewModel {
    this.logger.log(
      `Creating health view model from primitives: ${primitives}`,
    );
    return new HealthViewModel({
      status: primitives.status,
    });
  }
}
