import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureChangeStatusCommand } from '@/feature-context/features/application/commands/feature-change-status/feature-change-status.command';
import { FeatureCreateCommand } from '@/feature-context/features/application/commands/feature-create/feature-create.command';
import { FeatureDeleteCommand } from '@/feature-context/features/application/commands/feature-delete/feature-delete.command';
import { FeatureUpdateCommand } from '@/feature-context/features/application/commands/feature-update/feature-update.command';
import { CreateFeatureRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/create-feature.request.dto';
import { DeleteFeatureRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/delete-feature.request.dto';
import { FeatureChangeStatusRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/feature-change-status.request.dto';
import { UpdateFeatureRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/update-feature.request.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { CommandBus } from '@nestjs/cqrs';
import { FeatureMutationsResolver } from './feature-mutations.resolver';

describe('FeatureMutationsResolver', () => {
  let resolver: FeatureMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new FeatureMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFeature', () => {
    it('should create feature successfully', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: CreateFeatureRequestDto = {
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Feature created successfully',
        id: featureId,
      };

      mockCommandBus.execute.mockResolvedValue(featureId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.createFeature(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(FeatureCreateCommand);
      expect(command.key.value).toBe('advanced-analytics');
      expect(command.name.value).toBe('Advanced Analytics');
      expect(command.description?.value).toBe(
        'This feature enables advanced analytics capabilities',
      );
      expect(command.status.value).toBe(FeatureStatusEnum.ACTIVE);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Feature created successfully',
        id: featureId,
      });
    });

    it('should create feature with minimal properties', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: CreateFeatureRequestDto = {
        key: 'api-access',
        name: 'API Access',
        status: FeatureStatusEnum.ACTIVE,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Feature created successfully',
        id: featureId,
      };

      mockCommandBus.execute.mockResolvedValue(featureId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.createFeature(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureCreateCommand),
      );
    });

    it('should handle errors from command bus', async () => {
      const input: CreateFeatureRequestDto = {
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
      };

      const error = new Error('Feature key already exists');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.createFeature(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureCreateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('updateFeature', () => {
    it('should update feature successfully', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdateFeatureRequestDto = {
        id: featureId,
        name: 'Updated Name',
        description: 'Updated description',
        status: FeatureStatusEnum.INACTIVE,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Feature updated successfully',
        id: featureId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.updateFeature(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(FeatureUpdateCommand);
      expect(command.id.value).toBe(featureId);
      expect(command.name?.value).toBe('Updated Name');
      expect(command.description?.value).toBe('Updated description');
      expect(command.status?.value).toBe(FeatureStatusEnum.INACTIVE);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Feature updated successfully',
        id: featureId,
      });
    });

    it('should update feature with partial data', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdateFeatureRequestDto = {
        id: featureId,
        name: 'Updated Name',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Feature updated successfully',
        id: featureId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.updateFeature(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureUpdateCommand),
      );
    });

    it('should handle errors from command bus', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdateFeatureRequestDto = {
        id: featureId,
        name: 'Updated Name',
      };

      const error = new Error('Feature not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.updateFeature(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureUpdateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('deleteFeature', () => {
    it('should delete feature successfully', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: DeleteFeatureRequestDto = {
        id: featureId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Feature deleted successfully',
        id: featureId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.deleteFeature(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(FeatureDeleteCommand);
      expect(command.id).toBe(featureId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Feature deleted successfully',
        id: featureId,
      });
    });

    it('should handle errors from command bus', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: DeleteFeatureRequestDto = {
        id: featureId,
      };

      const error = new Error('Feature not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.deleteFeature(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureDeleteCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('changeFeatureStatus', () => {
    it('should change feature status successfully', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: FeatureChangeStatusRequestDto = {
        id: featureId,
        status: FeatureStatusEnum.INACTIVE,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Feature status changed successfully',
        id: featureId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.changeFeatureStatus(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureChangeStatusCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(FeatureChangeStatusCommand);
      expect(command.id.value).toBe(featureId);
      expect(command.status.value).toBe(FeatureStatusEnum.INACTIVE);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Feature status changed successfully',
        id: featureId,
      });
    });

    it('should change feature status to DEPRECATED', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: FeatureChangeStatusRequestDto = {
        id: featureId,
        status: FeatureStatusEnum.DEPRECATED,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Feature status changed successfully',
        id: featureId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.changeFeatureStatus(input);

      expect(result).toBe(mutationResponse);
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.status.value).toBe(FeatureStatusEnum.DEPRECATED);
    });

    it('should handle errors from command bus', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: FeatureChangeStatusRequestDto = {
        id: featureId,
        status: FeatureStatusEnum.INACTIVE,
      };

      const error = new Error('Feature not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.changeFeatureStatus(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureChangeStatusCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
