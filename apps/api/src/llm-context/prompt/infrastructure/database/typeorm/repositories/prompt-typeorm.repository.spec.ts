import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { PromptContentValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-content/prompt-content.vo';
import { PromptDescriptionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-description/prompt-description.vo';
import { PromptIsActiveValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-is-active/prompt-is-active.vo';
import { PromptSlugValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-slug/prompt-slug.vo';
import { PromptStatusValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-status/prompt-status.vo';
import { PromptTitleValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-title/prompt-title.vo';
import { PromptVersionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-version/prompt-version.vo';
import { PromptTypeormEntity } from '@/llm-context/prompt/infrastructure/database/typeorm/entities/prompt-typeorm.entity';
import { PromptTypeormMapper } from '@/llm-context/prompt/infrastructure/database/typeorm/mappers/prompt-typeorm.mapper';
import { PromptTypeormRepository } from '@/llm-context/prompt/infrastructure/database/typeorm/repositories/prompt-typeorm.repository';
import { Repository } from 'typeorm';

describe('PromptTypeormRepository', () => {
  let repository: PromptTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockPromptTypeormMapper: jest.Mocked<PromptTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<PromptTypeormEntity>>;
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
    } as unknown as jest.Mocked<Repository<PromptTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockPromptTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<PromptTypeormMapper>;

    repository = new PromptTypeormRepository(
      mockTypeormMasterService,
      mockPromptTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return prompt aggregate when prompt exists', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new PromptTypeormEntity();
      typeormEntity.id = promptId;
      typeormEntity.slug = 'test-prompt';
      typeormEntity.version = 1;
      typeormEntity.title = 'Test Prompt';
      typeormEntity.description = 'Test description';
      typeormEntity.content = 'Test content';
      typeormEntity.status = PromptStatusEnum.ACTIVE;
      typeormEntity.isActive = true;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const promptAggregate = new PromptAggregate(
        {
          id: new PromptUuidValueObject(promptId),
          slug: new PromptSlugValueObject('test-prompt'),
          version: new PromptVersionValueObject(1),
          title: new PromptTitleValueObject('Test Prompt'),
          description: new PromptDescriptionValueObject('Test description'),
          content: new PromptContentValueObject('Test content'),
          status: new PromptStatusValueObject(PromptStatusEnum.ACTIVE),
          isActive: new PromptIsActiveValueObject(true),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockPromptTypeormMapper.toDomainEntity.mockReturnValue(promptAggregate);

      const result = await repository.findById(promptId);

      expect(result).toBe(promptAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: promptId },
      });
      expect(mockPromptTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockPromptTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when prompt does not exist', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(promptId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: promptId },
      });
      expect(mockPromptTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save prompt aggregate and return saved aggregate', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const promptAggregate = new PromptAggregate(
        {
          id: new PromptUuidValueObject(promptId),
          slug: new PromptSlugValueObject('test-prompt'),
          version: new PromptVersionValueObject(1),
          title: new PromptTitleValueObject('Test Prompt'),
          description: new PromptDescriptionValueObject('Test description'),
          content: new PromptContentValueObject('Test content'),
          status: new PromptStatusValueObject(PromptStatusEnum.ACTIVE),
          isActive: new PromptIsActiveValueObject(true),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const typeormEntity = new PromptTypeormEntity();
      typeormEntity.id = promptId;
      typeormEntity.slug = 'test-prompt';
      typeormEntity.version = 1;
      typeormEntity.title = 'Test Prompt';
      typeormEntity.status = PromptStatusEnum.ACTIVE;
      typeormEntity.isActive = true;

      const savedTypeormEntity = new PromptTypeormEntity();
      savedTypeormEntity.id = promptId;
      savedTypeormEntity.slug = 'test-prompt';
      savedTypeormEntity.version = 1;
      savedTypeormEntity.title = 'Test Prompt';
      savedTypeormEntity.status = PromptStatusEnum.ACTIVE;
      savedTypeormEntity.isActive = true;

      const savedPromptAggregate = new PromptAggregate(
        {
          id: new PromptUuidValueObject(promptId),
          slug: new PromptSlugValueObject('test-prompt'),
          version: new PromptVersionValueObject(1),
          title: new PromptTitleValueObject('Test Prompt'),
          description: new PromptDescriptionValueObject('Test description'),
          content: new PromptContentValueObject('Test content'),
          status: new PromptStatusValueObject(PromptStatusEnum.ACTIVE),
          isActive: new PromptIsActiveValueObject(true),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockPromptTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockPromptTypeormMapper.toDomainEntity.mockReturnValue(
        savedPromptAggregate,
      );

      const result = await repository.save(promptAggregate);

      expect(result).toBe(savedPromptAggregate);
      expect(mockPromptTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
        promptAggregate,
      );
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockPromptTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete prompt and return true', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(promptId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(promptId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should return false when prompt does not exist', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(promptId);

      expect(result).toBe(false);
      expect(mockSoftDelete).toHaveBeenCalledWith(promptId);
    });

    it('should handle delete errors correctly', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Prompt not found');

      mockSoftDelete.mockRejectedValue(error);

      await expect(repository.delete(promptId)).rejects.toThrow(error);
      expect(mockSoftDelete).toHaveBeenCalledWith(promptId);
    });
  });
});
