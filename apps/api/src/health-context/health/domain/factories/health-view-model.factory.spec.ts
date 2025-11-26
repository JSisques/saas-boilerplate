import { HealthAggregate } from '@/health-context/health/domain/aggregates/health.aggregate';
import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { HealthViewModelFactory } from '@/health-context/health/domain/factories/health-view-model.factory';
import { HealthStatusValueObject } from '@/health-context/health/domain/value-objects/health-status/health-status.vo';
import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';

describe('HealthViewModelFactory', () => {
  let factory: HealthViewModelFactory;

  beforeEach(() => {
    factory = new HealthViewModelFactory();
  });

  const createAggregate = (
    status: HealthStatusEnum = HealthStatusEnum.OK,
    writeDatabaseStatus: HealthStatusEnum = HealthStatusEnum.OK,
    readDatabaseStatus: HealthStatusEnum = HealthStatusEnum.OK,
  ) =>
    new HealthAggregate({
      status: new HealthStatusValueObject(status),
      writeDatabaseStatus: new HealthStatusValueObject(writeDatabaseStatus),
      readDatabaseStatus: new HealthStatusValueObject(readDatabaseStatus),
    });

  it('should create view model from dto', () => {
    const viewModel = factory.create({
      status: HealthStatusEnum.OK,
      writeDatabaseStatus: HealthStatusEnum.OK,
      readDatabaseStatus: HealthStatusEnum.OK,
    });

    expect(viewModel).toBeInstanceOf(HealthViewModel);
    expect(viewModel.status).toBe(HealthStatusEnum.OK);
    expect(viewModel.writeDatabaseStatus).toBe(HealthStatusEnum.OK);
    expect(viewModel.readDatabaseStatus).toBe(HealthStatusEnum.OK);
  });

  it('should create view model from aggregate', () => {
    const aggregate = createAggregate(
      HealthStatusEnum.WARNING,
      HealthStatusEnum.WARNING,
      HealthStatusEnum.WARNING,
    );

    const viewModel = factory.fromAggregate(aggregate);

    expect(viewModel).toBeInstanceOf(HealthViewModel);
    expect(viewModel.status).toBe(HealthStatusEnum.WARNING);
    expect(viewModel.writeDatabaseStatus).toBe(HealthStatusEnum.WARNING);
    expect(viewModel.readDatabaseStatus).toBe(HealthStatusEnum.WARNING);
  });

  it('should create view model from primitives', () => {
    const primitives = {
      status: HealthStatusEnum.ERROR,
      writeDatabaseStatus: HealthStatusEnum.ERROR,
      readDatabaseStatus: HealthStatusEnum.ERROR,
    };

    const viewModel = factory.fromPrimitives(primitives);

    expect(viewModel.status).toBe(HealthStatusEnum.ERROR);
    expect(viewModel.writeDatabaseStatus).toBe(HealthStatusEnum.ERROR);
    expect(viewModel.readDatabaseStatus).toBe(HealthStatusEnum.ERROR);
  });
});
