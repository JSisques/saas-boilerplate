import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { PromptChangeStatusCommand } from '@/llm-context/prompt/application/commands/prompt-change-status/prompt-change-status.command';
import { PromptCreateCommand } from '@/llm-context/prompt/application/commands/prompt-create/prompt-create.command';
import { PromptDeleteCommand } from '@/llm-context/prompt/application/commands/prompt-delete/prompt-delete.command';
import { PromptUpdateCommand } from '@/llm-context/prompt/application/commands/prompt-update/prompt-update.command';
import { PromptChangeStatusRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-change-status.request.dto';
import { PromptCreateRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-create.request.dto';
import { PromptDeleteRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-delete.request.dto';
import { PromptUpdateRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-update.request.dto';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { CommandBus } from '@nestjs/cqrs';
import { PromptMutationsResolver } from './prompt-mutations.resolver';

describe('PromptMutationsResolver', () => {
  let resolver: PromptMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
      toResponseDtoArray: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new PromptMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('promptCreate', () => {
    it('should create prompt successfully and return mutation response', async () => {
      const input: PromptCreateRequestDto = {
        title: 'New Prompt',
        description: 'New description',
        content: 'New content',
        status: PromptStatusEnum.DRAFT,
      };

      const createdPromptId = '123e4567-e89b-12d3-a456-426614174000';

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Prompt created successfully',
        id: createdPromptId,
      };

      mockCommandBus.execute.mockResolvedValue(createdPromptId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.promptCreate(input);

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PromptCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(PromptCreateCommand);
      expect(command.title.value).toBe('New Prompt');
      expect(command.description?.value).toBe('New description');
      expect(command.content.value).toBe('New content');
      expect(command.status.value).toBe(PromptStatusEnum.DRAFT);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Prompt created successfully',
        id: createdPromptId,
      });
      expect(result).toBe(mutationResponse);
    });
  });

  describe('promptUpdate', () => {
    it('should update prompt successfully and return mutation response', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const input: PromptUpdateRequestDto = {
        id: promptId,
        title: 'Updated Prompt',
        description: 'Updated description',
        content: 'Updated content',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Prompt updated successfully',
        id: promptId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.promptUpdate(input);

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PromptUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(PromptUpdateCommand);
      expect(command.id.value).toBe(promptId);
      expect(command.title?.value).toBe('Updated Prompt');
      expect(command.description?.value).toBe('Updated description');
      expect(command.content?.value).toBe('Updated content');
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Prompt updated successfully',
        id: promptId,
      });
      expect(result).toBe(mutationResponse);
    });

    it('should update prompt with partial fields', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      // Only include title, omit description and content to test partial update
      const input: PromptUpdateRequestDto = {
        id: promptId,
        title: 'Updated Prompt',
        description: undefined as any,
        content: undefined as any,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Prompt updated successfully',
        id: promptId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.promptUpdate(input);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.title?.value).toBe('Updated Prompt');
      // When description is null and content is empty string, they are passed to the command
      // The command constructor handles undefined/null values
      expect(result).toBe(mutationResponse);
    });
  });

  describe('promptDelete', () => {
    it('should delete prompt successfully and return mutation response', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const input: PromptDeleteRequestDto = {
        id: promptId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Prompt deleted successfully',
        id: promptId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.promptDelete(input);

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PromptDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(PromptDeleteCommand);
      expect(command.id.value).toBe(promptId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Prompt deleted successfully',
        id: promptId,
      });
      expect(result).toBe(mutationResponse);
    });
  });

  describe('promptChangeStatus', () => {
    it('should change prompt status successfully and return mutation response', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const input: PromptChangeStatusRequestDto = {
        id: promptId,
        status: PromptStatusEnum.ACTIVE,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Prompt status changed successfully',
        id: promptId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.promptChangeStatus(input);

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(PromptChangeStatusCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(PromptChangeStatusCommand);
      expect(command.id.value).toBe(promptId);
      expect(command.status.value).toBe(PromptStatusEnum.ACTIVE);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Prompt status changed successfully',
        id: promptId,
      });
      expect(result).toBe(mutationResponse);
    });

    it('should handle different status values', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const statuses = [
        PromptStatusEnum.DRAFT,
        PromptStatusEnum.ARCHIVED,
        PromptStatusEnum.DEPRECATED,
      ];

      for (const status of statuses) {
        const input: PromptChangeStatusRequestDto = {
          id: promptId,
          status,
        };

        const mutationResponse: MutationResponseDto = {
          success: true,
          message: 'Prompt status changed successfully',
          id: promptId,
        };

        mockCommandBus.execute.mockResolvedValue(undefined);
        mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
          mutationResponse,
        );

        await resolver.promptChangeStatus(input);

        const command = (mockCommandBus.execute as jest.Mock).mock.calls[
          statuses.indexOf(status)
        ][0];
        expect(command.status.value).toBe(status);
      }

      expect(mockCommandBus.execute).toHaveBeenCalledTimes(statuses.length);
    });
  });
});
