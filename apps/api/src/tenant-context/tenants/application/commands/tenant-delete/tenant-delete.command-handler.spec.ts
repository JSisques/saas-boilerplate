import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDeleteCommand } from '@/tenant-context/tenants/application/commands/tenant-delete/tenant-delete.command';
import { TenantDeleteCommandHandler } from '@/tenant-context/tenants/application/commands/tenant-delete/tenant-delete.command-handler';
import { ITenantDeleteCommandDto } from '@/tenant-context/tenants/application/dtos/commands/tenant-delete/tenant-delete-command.dto';
import { TenantNotFoundException } from '@/tenant-context/tenants/application/exceptions/tenant-not-found/tenant-not-found.exception';
import { AssertTenantExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-exsits/assert-tenant-exsits.service';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantWriteRepository } from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { TenantNameValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantSlugValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-slug/tenant-slug.vo';
import { TenantStatusValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-status/tenant-status.vo';
import { EventBus } from '@nestjs/cqrs';

describe('TenantDeleteCommandHandler', () => {
  let handler: TenantDeleteCommandHandler;
  let mockTenantWriteRepository: jest.Mocked<TenantWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertTenantExsistsService: jest.Mocked<AssertTenantExsistsService>;

  beforeEach(() => {
    mockTenantWriteRepository = {
      findById: jest.fn(),
      findBySlug: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockAssertTenantExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantExsistsService>;

    handler = new TenantDeleteCommandHandler(
      mockTenantWriteRepository,
      mockEventBus,
      mockAssertTenantExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete tenant successfully when tenant exists', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ITenantDeleteCommandDto = {
        id: tenantId,
      };

      const command = new TenantDeleteCommand(commandDto);
      const existingTenant = new TenantAggregate(
        {
          id: new TenantUuidValueObject(tenantId),
          name: new TenantNameValueObject('Test Tenant'),
          slug: new TenantSlugValueObject('test-tenant'),
          description: null,
          websiteUrl: null,
          logoUrl: null,
          faviconUrl: null,
          primaryColor: null,
          secondaryColor: null,
          status: new TenantStatusValueObject(TenantStatusEnum.ACTIVE),
          email: null,
          phoneNumber: null,
          phoneCode: null,
          address: null,
          city: null,
          state: null,
          country: null,
          postalCode: null,
          timezone: null,
          locale: null,
          maxUsers: null,
          maxStorage: null,
          maxApiCalls: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const deleteSpy = jest.spyOn(existingTenant, 'delete');
      mockAssertTenantExsistsService.execute.mockResolvedValue(existingTenant);
      mockTenantWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertTenantExsistsService.execute).toHaveBeenCalledWith(
        tenantId,
      );
      expect(mockAssertTenantExsistsService.execute).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalled();
      expect(mockTenantWriteRepository.delete).toHaveBeenCalledWith(tenantId);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        existingTenant.getUncommittedEvents(),
      );
    });

    it('should throw TenantNotFoundException when tenant does not exist', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';

      const commandDto: ITenantDeleteCommandDto = {
        id: tenantId,
      };

      const command = new TenantDeleteCommand(commandDto);
      const error = new TenantNotFoundException(tenantId);

      mockAssertTenantExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(
        TenantNotFoundException,
      );
      expect(mockAssertTenantExsistsService.execute).toHaveBeenCalledWith(
        tenantId,
      );
      expect(mockTenantWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });
  });
});
