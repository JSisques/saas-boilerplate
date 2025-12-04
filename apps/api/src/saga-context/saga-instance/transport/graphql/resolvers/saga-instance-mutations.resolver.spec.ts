import { SagaInstanceChangeStatusCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-change-status/saga-instance-change-status.command';
import { SagaInstanceCreateCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-create/saga-instance-create.command';
import { SagaInstanceDeleteCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-delete/saga-instance-delete.command';
import { SagaInstanceUpdateCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-update/saga-instance-update.command';
import { SagaInstanceMutationsResolver } from '@/saga-context/saga-instance/transport/graphql/resolvers/saga-instance-mutations.resolver';
import { SagaInstanceChangeStatusRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-change-status.request.dto';
import { SagaInstanceCreateRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-create.request.dto';
import { SagaInstanceDeleteRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-delete.request.dto';
import { SagaInstanceUpdateRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-update.request.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { CommandBus } from '@nestjs/cqrs';

describe('SagaInstanceMutationsResolver', () => {
  let resolver: SagaInstanceMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new SagaInstanceMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
      {} as any, // sagaInstanceGraphQLMapper not used in mutations
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sagaInstanceCreate', () => {
    it('should create saga instance successfully', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaInstanceCreateRequestDto = {
        name: 'Order Processing Saga',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Saga instance created successfully',
        id: sagaInstanceId,
      };

      mockCommandBus.execute.mockResolvedValue(sagaInstanceId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.sagaInstanceCreate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaInstanceCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaInstanceCreateCommand);
      expect(command.name.value).toBe(input.name);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Saga instance created successfully',
        id: sagaInstanceId,
      });
    });
  });

  describe('sagaInstanceUpdate', () => {
    it('should update saga instance successfully', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaInstanceUpdateRequestDto = {
        id: sagaInstanceId,
        name: 'Updated Saga Name',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Saga instance updated successfully',
        id: sagaInstanceId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.sagaInstanceUpdate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaInstanceUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaInstanceUpdateCommand);
      expect(command.id.value).toBe(input.id);
      expect(command.name?.value).toBe(input.name);
      expect(command.status?.value).toBe(input.status);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Saga instance updated successfully',
        id: sagaInstanceId,
      });
    });
  });

  describe('sagaInstanceChangeStatus', () => {
    it('should change saga instance status successfully', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaInstanceChangeStatusRequestDto = {
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.COMPLETED,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Saga instance deleted successfully',
        id: sagaInstanceId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.sagaInstanceChangeStatus(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaInstanceChangeStatusCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaInstanceChangeStatusCommand);
      expect(command.id.value).toBe(input.id);
      expect(command.status.value).toBe(input.status);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Saga instance deleted successfully',
        id: sagaInstanceId,
      });
    });
  });

  describe('sagaInstanceDelete', () => {
    it('should delete saga instance successfully', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaInstanceDeleteRequestDto = {
        id: sagaInstanceId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Saga instance deleted successfully',
        id: sagaInstanceId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.sagaInstanceDelete(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaInstanceDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaInstanceDeleteCommand);
      expect(command.id.value).toBe(input.id);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Saga instance deleted successfully',
        id: sagaInstanceId,
      });
    });
  });
});
