import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantCreateCommand } from '@/tenant-context/tenants/application/commands/tenant-create/tenant-create.command';
import { TenantCreateCommandHandler } from '@/tenant-context/tenants/application/commands/tenant-create/tenant-create.command-handler';
import { ITenantCreateCommandDto } from '@/tenant-context/tenants/application/dtos/commands/tenant-create/tenant-create-command.dto';
import { TenantSlugIsNotUniqueException } from '@/tenant-context/tenants/application/exceptions/tenant-slug-is-not-unique/tenant-slug-is-not-unique.exception';
import { AssertTenantSlugIsUniqueService } from '@/tenant-context/tenants/application/services/assert-tenant-slug-is-unique/assert-tenant-slug-is-unique.service';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { TenantAggregateFactory } from '@/tenant-context/tenants/domain/factories/tenant-aggregate/tenant-aggregate.factory';
import { TenantWriteRepository } from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { EventBus } from '@nestjs/cqrs';

describe('TenantCreateCommandHandler', () => {
  let handler: TenantCreateCommandHandler;
  let mockTenantWriteRepository: jest.Mocked<TenantWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockTenantAggregateFactory: jest.Mocked<TenantAggregateFactory>;
  let mockAssertTenantSlugIsUniqueService: jest.Mocked<AssertTenantSlugIsUniqueService>;

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

    mockTenantAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<TenantAggregateFactory>;

    mockAssertTenantSlugIsUniqueService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantSlugIsUniqueService>;

    handler = new TenantCreateCommandHandler(
      mockTenantWriteRepository,
      mockEventBus,
      mockTenantAggregateFactory,
      mockAssertTenantSlugIsUniqueService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create tenant successfully when slug is unique', async () => {
      const commandDto: ITenantCreateCommandDto = {
        name: 'Test Tenant',
        description: 'Test description',
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
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
      };

      const command = new TenantCreateCommand(commandDto);
      const mockTenant = new TenantAggregate(
        {
          id: command.id,
          name: command.name,
          slug: command.slug,
          description: command.description,
          websiteUrl: command.websiteUrl,
          logoUrl: command.logoUrl,
          faviconUrl: command.faviconUrl,
          primaryColor: command.primaryColor,
          secondaryColor: command.secondaryColor,
          status: command.status,
          email: command.email,
          phoneNumber: command.phoneNumber,
          phoneCode: command.phoneCode,
          address: command.address,
          city: command.city,
          state: command.state,
          country: command.country,
          postalCode: command.postalCode,
          timezone: command.timezone,
          locale: command.locale,
          maxUsers: command.maxUsers,
          maxStorage: command.maxStorage,
          maxApiCalls: command.maxApiCalls,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertTenantSlugIsUniqueService.execute.mockResolvedValue(undefined);
      mockTenantAggregateFactory.create.mockReturnValue(mockTenant);
      mockTenantWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockTenant.id.value);
      expect(mockAssertTenantSlugIsUniqueService.execute).toHaveBeenCalledWith(
        command.slug.value,
      );
      expect(mockTenantAggregateFactory.create).toHaveBeenCalled();
      expect(mockTenantWriteRepository.save).toHaveBeenCalledWith(mockTenant);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockTenant.getUncommittedEvents(),
      );
    });

    it('should throw TenantSlugIsNotUniqueException when slug is not unique', async () => {
      const commandDto: ITenantCreateCommandDto = {
        name: 'Test Tenant',
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
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
      };

      const command = new TenantCreateCommand(commandDto);
      const error = new TenantSlugIsNotUniqueException(command.slug.value);

      mockAssertTenantSlugIsUniqueService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(
        TenantSlugIsNotUniqueException,
      );
      expect(mockAssertTenantSlugIsUniqueService.execute).toHaveBeenCalledWith(
        command.slug.value,
      );
      expect(mockTenantAggregateFactory.create).not.toHaveBeenCalled();
      expect(mockTenantWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });
  });
});
