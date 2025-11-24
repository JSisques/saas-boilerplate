import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BasePrismaMasterRepository } from './base-prisma-master.repository';

describe('BasePrismaRepository', () => {
  let repository: BasePrismaMasterRepository;
  let prismaMasterService: PrismaMasterService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        PrismaMasterService,
        {
          provide: BasePrismaMasterRepository,
          useFactory: (prismaMasterService: PrismaMasterService) => {
            return new BasePrismaMasterRepository(prismaMasterService);
          },
          inject: [PrismaMasterService],
        },
      ],
    }).compile();

    prismaMasterService = module.get<PrismaMasterService>(PrismaMasterService);
    repository = module.get<BasePrismaMasterRepository>(
      BasePrismaMasterRepository,
    );
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should have prismaService injected', () => {
    expect(repository['prismaMasterService']).toBe(prismaMasterService);
  });

  it('should have logger initialized', () => {
    expect(repository['logger']).toBeDefined();
  });

  it('should inherit from BaseDatabaseRepository', () => {
    expect(repository).toBeInstanceOf(BasePrismaMasterRepository);
  });

  it('should have access to calculatePagination method', async () => {
    const criteria = { pagination: { page: 1, perPage: 10 } } as any;

    const result = await repository.calculatePagination(criteria);

    expect(result).toBeDefined();
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.skip).toBe(0);
  });
});
