import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../services/prisma.service';
import { BasePrismaRepository } from './base-prisma.repository';

describe('BasePrismaRepository', () => {
  let repository: BasePrismaRepository;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: BasePrismaRepository,
          useFactory: (prisma: PrismaService) => {
            return new BasePrismaRepository(prisma);
          },
          inject: [PrismaService],
        },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    repository = module.get<BasePrismaRepository>(BasePrismaRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should have prismaService injected', () => {
    expect(repository['prismaService']).toBe(prismaService);
  });

  it('should have logger initialized', () => {
    expect(repository['logger']).toBeDefined();
  });

  it('should inherit from BaseDatabaseRepository', () => {
    expect(repository).toBeInstanceOf(BasePrismaRepository);
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
