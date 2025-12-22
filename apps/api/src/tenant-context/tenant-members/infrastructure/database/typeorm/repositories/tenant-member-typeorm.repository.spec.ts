import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { TenantMemberTypeormEntity } from '@/tenant-context/tenant-members/infrastructure/database/typeorm/entities/tenant-member-typeorm.entity';
import { TenantMemberTypeormMapper } from '@/tenant-context/tenant-members/infrastructure/database/typeorm/mappers/tenant-member-typeorm.mapper';
import { TenantMemberTypeormRepository } from '@/tenant-context/tenant-members/infrastructure/database/typeorm/repositories/tenant-member-typeorm.repository';
import { Repository } from 'typeorm';

describe('TenantMemberTypeormRepository', () => {
  let repository: TenantMemberTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockTenantMemberTypeormMapper: jest.Mocked<TenantMemberTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<TenantMemberTypeormEntity>>;
  let mockFindOne: jest.Mock;
  let mockFind: jest.Mock;
  let mockSave: jest.Mock;
  let mockSoftDelete: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockFind = jest.fn();
    mockSave = jest.fn();
    mockSoftDelete = jest.fn();

    mockTypeormRepository = {
      findOne: mockFindOne,
      find: mockFind,
      save: mockSave,
      softDelete: mockSoftDelete,
    } as unknown as jest.Mocked<Repository<TenantMemberTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockTenantMemberTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberTypeormMapper>;

    repository = new TenantMemberTypeormRepository(
      mockTypeormMasterService,
      mockTenantMemberTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return tenant member aggregate when tenant member exists', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const userId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new TenantMemberTypeormEntity();
      typeormEntity.id = tenantMemberId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.userId = userId;
      typeormEntity.role = TenantMemberRoleEnum.OWNER;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const tenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(tenantId),
          userId: new UserUuidValueObject(userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.OWNER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockTenantMemberTypeormMapper.toDomainEntity.mockReturnValue(
        tenantMemberAggregate,
      );

      const result = await repository.findById(tenantMemberId);

      expect(result).toBe(tenantMemberAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: tenantMemberId },
      });
      expect(mockTenantMemberTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(
        mockTenantMemberTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return null when tenant member does not exist', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(tenantMemberId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: tenantMemberId },
      });
      expect(
        mockTenantMemberTypeormMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByTenantId', () => {
    it('should return tenant member aggregates when tenant members exist', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const userId1 = '323e4567-e89b-12d3-a456-426614174000';
      const userId2 = '423e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity1 = new TenantMemberTypeormEntity();
      typeormEntity1.id = '123e4567-e89b-12d3-a456-426614174000';
      typeormEntity1.tenantId = tenantId;
      typeormEntity1.userId = userId1;
      typeormEntity1.role = TenantMemberRoleEnum.OWNER;

      const typeormEntity2 = new TenantMemberTypeormEntity();
      typeormEntity2.id = '223e4567-e89b-12d3-a456-426614174000';
      typeormEntity2.tenantId = tenantId;
      typeormEntity2.userId = userId2;
      typeormEntity2.role = TenantMemberRoleEnum.MEMBER;

      const tenantMemberAggregate1 = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(typeormEntity1.id),
          tenantId: new TenantUuidValueObject(tenantId),
          userId: new UserUuidValueObject(userId1),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.OWNER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const tenantMemberAggregate2 = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(typeormEntity2.id),
          tenantId: new TenantUuidValueObject(tenantId),
          userId: new UserUuidValueObject(userId2),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFind.mockResolvedValue([typeormEntity1, typeormEntity2]);
      mockTenantMemberTypeormMapper.toDomainEntity
        .mockReturnValueOnce(tenantMemberAggregate1)
        .mockReturnValueOnce(tenantMemberAggregate2);

      const result = await repository.findByTenantId(tenantId);

      expect(result).toEqual([tenantMemberAggregate1, tenantMemberAggregate2]);
      expect(mockFind).toHaveBeenCalledWith({
        where: { tenantId },
      });
      expect(
        mockTenantMemberTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledTimes(2);
    });

    it('should return null when no tenant members exist', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';

      mockFind.mockResolvedValue([]);

      const result = await repository.findByTenantId(tenantId);

      expect(result).toBeNull();
      expect(mockFind).toHaveBeenCalledWith({
        where: { tenantId },
      });
      expect(
        mockTenantMemberTypeormMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return tenant member aggregates when tenant members exist', async () => {
      const userId = '323e4567-e89b-12d3-a456-426614174000';
      const tenantId1 = '223e4567-e89b-12d3-a456-426614174000';
      const tenantId2 = '523e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity1 = new TenantMemberTypeormEntity();
      typeormEntity1.id = '123e4567-e89b-12d3-a456-426614174000';
      typeormEntity1.tenantId = tenantId1;
      typeormEntity1.userId = userId;
      typeormEntity1.role = TenantMemberRoleEnum.OWNER;

      const typeormEntity2 = new TenantMemberTypeormEntity();
      typeormEntity2.id = '223e4567-e89b-12d3-a456-426614174000';
      typeormEntity2.tenantId = tenantId2;
      typeormEntity2.userId = userId;
      typeormEntity2.role = TenantMemberRoleEnum.MEMBER;

      const tenantMemberAggregate1 = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(typeormEntity1.id),
          tenantId: new TenantUuidValueObject(tenantId1),
          userId: new UserUuidValueObject(userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.OWNER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const tenantMemberAggregate2 = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(typeormEntity2.id),
          tenantId: new TenantUuidValueObject(tenantId2),
          userId: new UserUuidValueObject(userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFind.mockResolvedValue([typeormEntity1, typeormEntity2]);
      mockTenantMemberTypeormMapper.toDomainEntity
        .mockReturnValueOnce(tenantMemberAggregate1)
        .mockReturnValueOnce(tenantMemberAggregate2);

      const result = await repository.findByUserId(userId);

      expect(result).toEqual([tenantMemberAggregate1, tenantMemberAggregate2]);
      expect(mockFind).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(
        mockTenantMemberTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledTimes(2);
    });

    it('should return null when no tenant members exist', async () => {
      const userId = '323e4567-e89b-12d3-a456-426614174000';

      mockFind.mockResolvedValue([]);

      const result = await repository.findByUserId(userId);

      expect(result).toBeNull();
      expect(mockFind).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(
        mockTenantMemberTypeormMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByTenantIdAndUserId', () => {
    it('should return tenant member aggregate when tenant member exists', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const userId = '323e4567-e89b-12d3-a456-426614174000';
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new TenantMemberTypeormEntity();
      typeormEntity.id = tenantMemberId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.userId = userId;
      typeormEntity.role = TenantMemberRoleEnum.OWNER;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const tenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(tenantId),
          userId: new UserUuidValueObject(userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.OWNER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockTenantMemberTypeormMapper.toDomainEntity.mockReturnValue(
        tenantMemberAggregate,
      );

      const result = await repository.findByTenantIdAndUserId(tenantId, userId);

      expect(result).toBe(tenantMemberAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { tenantId, userId },
      });
      expect(mockTenantMemberTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(
        mockTenantMemberTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return null when tenant member does not exist', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const userId = '323e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findByTenantIdAndUserId(tenantId, userId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { tenantId, userId },
      });
      expect(
        mockTenantMemberTypeormMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save tenant member aggregate and return saved aggregate', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const userId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const tenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(tenantId),
          userId: new UserUuidValueObject(userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.OWNER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const typeormEntity = new TenantMemberTypeormEntity();
      typeormEntity.id = tenantMemberId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.userId = userId;
      typeormEntity.role = TenantMemberRoleEnum.OWNER;

      const savedTypeormEntity = new TenantMemberTypeormEntity();
      savedTypeormEntity.id = tenantMemberId;
      savedTypeormEntity.tenantId = tenantId;
      savedTypeormEntity.userId = userId;
      savedTypeormEntity.role = TenantMemberRoleEnum.OWNER;

      const savedTenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(tenantId),
          userId: new UserUuidValueObject(userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.OWNER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockTenantMemberTypeormMapper.toTypeormEntity.mockReturnValue(
        typeormEntity,
      );
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockTenantMemberTypeormMapper.toDomainEntity.mockReturnValue(
        savedTenantMemberAggregate,
      );

      const result = await repository.save(tenantMemberAggregate);

      expect(result).toBe(savedTenantMemberAggregate);
      expect(
        mockTenantMemberTypeormMapper.toTypeormEntity,
      ).toHaveBeenCalledWith(tenantMemberAggregate);
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockTenantMemberTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete tenant member and return true', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(tenantMemberId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(tenantMemberId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should return false when tenant member does not exist', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(tenantMemberId);

      expect(result).toBe(false);
      expect(mockSoftDelete).toHaveBeenCalledWith(tenantMemberId);
    });

    it('should handle delete errors correctly', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Tenant member not found');

      mockSoftDelete.mockRejectedValue(error);

      await expect(repository.delete(tenantMemberId)).rejects.toThrow(error);
      expect(mockSoftDelete).toHaveBeenCalledWith(tenantMemberId);
    });
  });
});
