import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantTypeormEntity } from '@/tenant-context/tenants/infrastructure/database/typeorm/entities/tenant-typeorm.entity';
import { TenantTypeormMapper } from '@/tenant-context/tenants/infrastructure/database/typeorm/mappers/tenant-typeorm.mapper';
import { TenantTypeormRepository } from '@/tenant-context/tenants/infrastructure/database/typeorm/repositories/tenant-typeorm.repository';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Repository } from 'typeorm';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantNameValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantSlugValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-slug/tenant-slug.vo';
import { TenantStatusValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-status/tenant-status.vo';

describe('TenantTypeormRepository', () => {
  let repository: TenantTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockTenantTypeormMapper: jest.Mocked<TenantTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<TenantTypeormEntity>>;
  let mockFindOne: jest.Mock;
  let mockSave: jest.Mock;
  let mockSoftDelete: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockSave = jest.fn();
    mockSoftDelete = jest.fn();

    mockTypeormRepository = {
      findOne: mockFindOne,
      save: mockSave,
      softDelete: mockSoftDelete,
    } as unknown as jest.Mocked<Repository<TenantTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockTenantTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<TenantTypeormMapper>;

    repository = new TenantTypeormRepository(
      mockTypeormMasterService,
      mockTenantTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return tenant aggregate when tenant exists', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new TenantTypeormEntity();
      typeormEntity.id = tenantId;
      typeormEntity.name = 'Test Tenant';
      typeormEntity.slug = 'test-tenant';
      typeormEntity.status = TenantStatusEnum.ACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const tenantAggregate = new TenantAggregate(
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

      mockFindOne.mockResolvedValue(typeormEntity);
      mockTenantTypeormMapper.toDomainEntity.mockReturnValue(tenantAggregate);

      const result = await repository.findById(tenantId);

      expect(result).toBe(tenantAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: tenantId },
      });
      expect(mockTenantTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockTenantTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when tenant does not exist', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(tenantId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: tenantId },
      });
      expect(mockTenantTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('should return tenant aggregate when tenant exists', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const slug = 'test-tenant';
      const now = new Date();

      const typeormEntity = new TenantTypeormEntity();
      typeormEntity.id = tenantId;
      typeormEntity.name = 'Test Tenant';
      typeormEntity.slug = slug;
      typeormEntity.status = TenantStatusEnum.ACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const tenantAggregate = new TenantAggregate(
        {
          id: new TenantUuidValueObject(tenantId),
          name: new TenantNameValueObject('Test Tenant'),
          slug: new TenantSlugValueObject(slug),
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

      mockFindOne.mockResolvedValue(typeormEntity);
      mockTenantTypeormMapper.toDomainEntity.mockReturnValue(tenantAggregate);

      const result = await repository.findBySlug(slug);

      expect(result).toBe(tenantAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { slug },
      });
      expect(mockTenantTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockTenantTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when tenant does not exist', async () => {
      const slug = 'test-tenant';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findBySlug(slug);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { slug },
      });
      expect(mockTenantTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save tenant aggregate and return saved aggregate', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const tenantAggregate = new TenantAggregate(
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

      const typeormEntity = new TenantTypeormEntity();
      typeormEntity.id = tenantId;
      typeormEntity.name = 'Test Tenant';
      typeormEntity.slug = 'test-tenant';
      typeormEntity.status = TenantStatusEnum.ACTIVE;

      const savedTypeormEntity = new TenantTypeormEntity();
      savedTypeormEntity.id = tenantId;
      savedTypeormEntity.name = 'Test Tenant';
      savedTypeormEntity.slug = 'test-tenant';
      savedTypeormEntity.status = TenantStatusEnum.ACTIVE;

      const savedTenantAggregate = new TenantAggregate(
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

      mockTenantTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockTenantTypeormMapper.toDomainEntity.mockReturnValue(
        savedTenantAggregate,
      );

      const result = await repository.save(tenantAggregate);

      expect(result).toBe(savedTenantAggregate);
      expect(mockTenantTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
        tenantAggregate,
      );
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockTenantTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete tenant and return true', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(tenantId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(tenantId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should return false when tenant does not exist', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(tenantId);

      expect(result).toBe(false);
      expect(mockSoftDelete).toHaveBeenCalledWith(tenantId);
    });

    it('should handle delete errors correctly', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Tenant not found');

      mockSoftDelete.mockRejectedValue(error);

      await expect(repository.delete(tenantId)).rejects.toThrow(error);
      expect(mockSoftDelete).toHaveBeenCalledWith(tenantId);
    });
  });
});
