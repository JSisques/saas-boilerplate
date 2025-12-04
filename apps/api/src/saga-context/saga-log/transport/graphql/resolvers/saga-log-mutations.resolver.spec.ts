import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogDeleteCommand } from '@/saga-context/saga-log/application/commands/saga-log-delete/saga-log-delete.command';
import { SagaLogUpdateCommand } from '@/saga-context/saga-log/application/commands/saga-log-update/saga-log-update.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogMutationsResolver } from '@/saga-context/saga-log/transport/graphql/resolvers/saga-log-mutations.resolver';
import { SagaLogCreateRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-create.request.dto';
import { SagaLogDeleteRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-delete.request.dto';
import { SagaLogUpdateRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-update.request.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { CommandBus } from '@nestjs/cqrs';

describe('SagaLogMutationsResolver', () => {
  let resolver: SagaLogMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new SagaLogMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sagaLogCreate', () => {
    it('should create saga log successfully', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaLogCreateRequestDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Saga log created successfully',
        id: sagaLogId,
      };

      mockCommandBus.execute.mockResolvedValue(sagaLogId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.sagaLogCreate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaLogCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaLogCreateCommand);
      expect(command.sagaInstanceId.value).toBe(input.sagaInstanceId);
      expect(command.sagaStepId.value).toBe(input.sagaStepId);
      expect(command.type.value).toBe(input.type);
      expect(command.message.value).toBe(input.message);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Saga log created successfully',
        id: sagaLogId,
      });
    });

    it('should handle different log types', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const types = [
        SagaLogTypeEnum.INFO,
        SagaLogTypeEnum.WARNING,
        SagaLogTypeEnum.ERROR,
        SagaLogTypeEnum.DEBUG,
      ];

      for (const type of types) {
        const input: SagaLogCreateRequestDto = {
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: type,
          message: `Test message for ${type}`,
        };

        mockCommandBus.execute.mockResolvedValue(sagaLogId);
        mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue({
          success: true,
          message: 'Saga log created successfully',
          id: sagaLogId,
        });

        await resolver.sagaLogCreate(input);

        const command = (mockCommandBus.execute as jest.Mock).mock.calls[
          mockCommandBus.execute.mock.calls.length - 1
        ][0];
        expect(command.type.value).toBe(type);
        expect(command.message.value).toBe(`Test message for ${type}`);
      }
    });
  });

  describe('sagaLogUpdate', () => {
    it('should update saga log successfully', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaLogUpdateRequestDto = {
        id: sagaLogId,
        type: SagaLogTypeEnum.ERROR,
        message: 'Updated log message',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Saga log updated successfully',
        id: sagaLogId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.sagaLogUpdate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaLogUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaLogUpdateCommand);
      expect(command.id.value).toBe(sagaLogId);
      expect(command.type?.value).toBe(input.type);
      expect(command.message?.value).toBe(input.message);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Saga log updated successfully',
        id: sagaLogId,
      });
    });

    it('should update saga log with only type', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaLogUpdateRequestDto = {
        id: sagaLogId,
        type: SagaLogTypeEnum.WARNING,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue({
        success: true,
        message: 'Saga log updated successfully',
        id: sagaLogId,
      });

      await resolver.sagaLogUpdate(input);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.type?.value).toBe(input.type);
      expect(command.message).toBeUndefined();
    });

    it('should update saga log with only message', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaLogUpdateRequestDto = {
        id: sagaLogId,
        message: 'Updated message',
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue({
        success: true,
        message: 'Saga log updated successfully',
        id: sagaLogId,
      });

      await resolver.sagaLogUpdate(input);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.message?.value).toBe(input.message);
      expect(command.type).toBeUndefined();
    });
  });

  describe('sagaLogDelete', () => {
    it('should delete saga log successfully', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaLogDeleteRequestDto = {
        id: sagaLogId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Saga log deleted successfully',
        id: sagaLogId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.sagaLogDelete(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaLogDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaLogDeleteCommand);
      expect(command.id.value).toBe(sagaLogId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Saga log deleted successfully',
        id: sagaLogId,
      });
    });
  });
});
