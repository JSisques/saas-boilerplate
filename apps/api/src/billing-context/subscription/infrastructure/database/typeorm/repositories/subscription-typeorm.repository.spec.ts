import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import { SubscriptionRenewalMethodEnum } from '@/billing-context/subscription/domain/enum/subscription-renewal-method.enum';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import { SubscriptionEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-end-date/subscription-end-date.vo';
import { SubscriptionRenewalMethodValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-renewal-method copy/subscription-renewal-method.vo';
import { SubscriptionStartDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-start-date/subscription-start-date.vo';
import { SubscriptionStatusValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-status/subscription-status.vo';
import { SubscriptionTypeormEntity } from '@/billing-context/subscription/infrastructure/database/typeorm/entities/subscription-typeorm.entity';
import { SubscriptionTypeormMapper } from '@/billing-context/subscription/infrastructure/database/typeorm/mappers/subscription-typeorm.mapper';
import { SubscriptionTypeormRepository } from '@/billing-context/subscription/infrastructure/database/typeorm/repositories/subscription-typeorm.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Repository } from 'typeorm';

describe('SubscriptionTypeormRepository', () => {
  let repository: SubscriptionTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockSubscriptionTypeormMapper: jest.Mocked<SubscriptionTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<SubscriptionTypeormEntity>>;
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
    } as unknown as jest.Mocked<Repository<SubscriptionTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockSubscriptionTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionTypeormMapper>;

    repository = new SubscriptionTypeormRepository(
      mockTypeormMasterService,
      mockSubscriptionTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return subscription aggregate when subscription exists', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const planId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();

      const typeormEntity = new SubscriptionTypeormEntity();
      typeormEntity.id = subscriptionId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.planId = planId;
      typeormEntity.startDate = startDate;
      typeormEntity.endDate = endDate;
      typeormEntity.status = SubscriptionStatusEnum.ACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const subscriptionAggregate = new SubscriptionAggregate(
        {
          id: new SubscriptionUuidValueObject(subscriptionId),
          tenantId: new TenantUuidValueObject(tenantId),
          planId: new SubscriptionPlanUuidValueObject(planId),
          startDate: new SubscriptionStartDateValueObject(startDate),
          endDate: new SubscriptionEndDateValueObject(endDate),
          trialEndDate: null,
          status: new SubscriptionStatusValueObject(
            SubscriptionStatusEnum.ACTIVE,
          ),
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          renewalMethod: new SubscriptionRenewalMethodValueObject(
            SubscriptionRenewalMethodEnum.AUTOMATIC,
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockSubscriptionTypeormMapper.toDomainEntity.mockReturnValue(
        subscriptionAggregate,
      );

      const result = await repository.findById(subscriptionId);

      expect(result).toBe(subscriptionAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: subscriptionId },
      });
      expect(mockSubscriptionTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
    });

    it('should return null when subscription does not exist', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(subscriptionId);

      expect(result).toBeNull();
      expect(
        mockSubscriptionTypeormMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByTenantId', () => {
    it('should return subscription aggregate when subscription exists', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const planId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();

      const typeormEntity = new SubscriptionTypeormEntity();
      typeormEntity.id = subscriptionId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.planId = planId;
      typeormEntity.startDate = startDate;
      typeormEntity.endDate = endDate;
      typeormEntity.status = SubscriptionStatusEnum.ACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const subscriptionAggregate = new SubscriptionAggregate(
        {
          id: new SubscriptionUuidValueObject(subscriptionId),
          tenantId: new TenantUuidValueObject(tenantId),
          planId: new SubscriptionPlanUuidValueObject(planId),
          startDate: new SubscriptionStartDateValueObject(startDate),
          endDate: new SubscriptionEndDateValueObject(endDate),
          trialEndDate: null,
          status: new SubscriptionStatusValueObject(
            SubscriptionStatusEnum.ACTIVE,
          ),
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          renewalMethod: new SubscriptionRenewalMethodValueObject(
            SubscriptionRenewalMethodEnum.AUTOMATIC,
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockSubscriptionTypeormMapper.toDomainEntity.mockReturnValue(
        subscriptionAggregate,
      );

      const result = await repository.findByTenantId(tenantId);

      expect(result).toBe(subscriptionAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { tenantId },
      });
    });
  });

  describe('save', () => {
    it('should save subscription aggregate and return saved aggregate', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const planId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();

      const subscriptionAggregate = new SubscriptionAggregate(
        {
          id: new SubscriptionUuidValueObject(subscriptionId),
          tenantId: new TenantUuidValueObject(tenantId),
          planId: new SubscriptionPlanUuidValueObject(planId),
          startDate: new SubscriptionStartDateValueObject(startDate),
          endDate: new SubscriptionEndDateValueObject(endDate),
          trialEndDate: null,
          status: new SubscriptionStatusValueObject(
            SubscriptionStatusEnum.ACTIVE,
          ),
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          renewalMethod: new SubscriptionRenewalMethodValueObject(
            SubscriptionRenewalMethodEnum.AUTOMATIC,
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const typeormEntity = new SubscriptionTypeormEntity();
      typeormEntity.id = subscriptionId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.planId = planId;
      typeormEntity.startDate = startDate;
      typeormEntity.endDate = endDate;
      typeormEntity.status = SubscriptionStatusEnum.ACTIVE;

      const savedTypeormEntity = new SubscriptionTypeormEntity();
      savedTypeormEntity.id = subscriptionId;
      savedTypeormEntity.tenantId = tenantId;
      savedTypeormEntity.planId = planId;
      savedTypeormEntity.startDate = startDate;
      savedTypeormEntity.endDate = endDate;
      savedTypeormEntity.status = SubscriptionStatusEnum.ACTIVE;

      const savedSubscriptionAggregate = new SubscriptionAggregate(
        {
          id: new SubscriptionUuidValueObject(subscriptionId),
          tenantId: new TenantUuidValueObject(tenantId),
          planId: new SubscriptionPlanUuidValueObject(planId),
          startDate: new SubscriptionStartDateValueObject(startDate),
          endDate: new SubscriptionEndDateValueObject(endDate),
          trialEndDate: null,
          status: new SubscriptionStatusValueObject(
            SubscriptionStatusEnum.ACTIVE,
          ),
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          renewalMethod: new SubscriptionRenewalMethodValueObject(
            SubscriptionRenewalMethodEnum.AUTOMATIC,
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSubscriptionTypeormMapper.toTypeormEntity.mockReturnValue(
        typeormEntity,
      );
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockSubscriptionTypeormMapper.toDomainEntity.mockReturnValue(
        savedSubscriptionAggregate,
      );

      const result = await repository.save(subscriptionAggregate);

      expect(result).toBe(savedSubscriptionAggregate);
      expect(
        mockSubscriptionTypeormMapper.toTypeormEntity,
      ).toHaveBeenCalledWith(subscriptionAggregate);
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockSubscriptionTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
    });
  });

  describe('delete', () => {
    it('should soft delete subscription and return true', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(subscriptionId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(subscriptionId);
    });

    it('should return false when subscription does not exist', async () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(subscriptionId);

      expect(result).toBe(false);
    });
  });
});
