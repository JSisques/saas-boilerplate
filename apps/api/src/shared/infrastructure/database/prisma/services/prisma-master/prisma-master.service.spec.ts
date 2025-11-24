import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

describe('PrismaMasterService', () => {
  let service: PrismaMasterService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [PrismaMasterService],
    }).compile();

    service = module.get<PrismaMasterService>(PrismaMasterService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to Prisma', async () => {
      const connectSpy = jest
        .spyOn(PrismaClient.prototype, '$connect')
        .mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalledTimes(1);
      connectSpy.mockRestore();
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      const connectSpy = jest
        .spyOn(PrismaClient.prototype, '$connect')
        .mockRejectedValue(error);
      const errorSpy = jest.spyOn(service['logger'], 'error');

      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error connecting to Prisma'),
      );
      connectSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from Prisma', async () => {
      const disconnectSpy = jest
        .spyOn(PrismaClient.prototype, '$disconnect')
        .mockResolvedValue(undefined);

      await service.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalledTimes(1);
      disconnectSpy.mockRestore();
    });

    it('should handle disconnection errors', async () => {
      const error = new Error('Disconnection failed');
      const disconnectSpy = jest
        .spyOn(PrismaClient.prototype, '$disconnect')
        .mockRejectedValue(error);
      const errorSpy = jest.spyOn(service['logger'], 'error');

      await service.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error disconnecting from Prisma'),
      );
      disconnectSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
