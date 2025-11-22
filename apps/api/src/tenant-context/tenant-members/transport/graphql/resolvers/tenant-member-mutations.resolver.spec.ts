import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { TenantMemberAddCommand } from '@/tenant-context/tenant-members/application/commands/tenant-member-add/tenant-member-add.command';
import { TenantMemberRemoveCommand } from '@/tenant-context/tenant-members/application/commands/tenant-member-remove/tenant-member-remove.command';
import { TenantMemberUpdateCommand } from '@/tenant-context/tenant-members/application/commands/tenant-member-update/tenant-member-update.command';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberAddRequestDto } from '@/tenant-context/tenant-members/transport/graphql/dtos/requests/tenant-member-add.request.dto';
import { TenantMemberRemoveRequestDto } from '@/tenant-context/tenant-members/transport/graphql/dtos/requests/tenant-member-remove.request.dto';
import { TenantMemberUpdateRequestDto } from '@/tenant-context/tenant-members/transport/graphql/dtos/requests/tenant-member-update.request.dto';
import { CommandBus } from '@nestjs/cqrs';
import { TenantMemberMutationsResolver } from './tenant-member-mutations.resolver';

describe('TenantMemberMutationsResolver', () => {
  let resolver: TenantMemberMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new TenantMemberMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('tenantMemberAdd', () => {
    it('should add tenant member successfully', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantMemberAddRequestDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Tenant member added successfully',
        id: tenantMemberId,
      };

      mockCommandBus.execute.mockResolvedValue(tenantMemberId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.tenantMemberAdd(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantMemberAddCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(TenantMemberAddCommand);
      expect(command.tenantId.value).toBe(input.tenantId);
      expect(command.userId.value).toBe(input.userId);
      expect(command.role.value).toBe(input.role);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Tenant member added successfully',
        id: tenantMemberId,
      });
    });

    it('should handle errors from command bus', async () => {
      const input: TenantMemberAddRequestDto = {
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
      };

      const error = new Error('Tenant member already exists');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantMemberAdd(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantMemberAddCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });

    it('should add tenant member with different roles', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const roles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
        TenantMemberRoleEnum.MEMBER,
        TenantMemberRoleEnum.GUEST,
      ];

      for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        const input: TenantMemberAddRequestDto = {
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role,
        };

        const mutationResponse: MutationResponseDto = {
          success: true,
          message: 'Tenant member added successfully',
          id: tenantMemberId,
        };

        mockCommandBus.execute.mockResolvedValue(tenantMemberId);
        mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
          mutationResponse,
        );

        await resolver.tenantMemberAdd(input);

        const command = (mockCommandBus.execute as jest.Mock).mock.calls[i][0];
        expect(command.role.value).toBe(role);
      }
    });
  });

  describe('tenantMemberUpdate', () => {
    it('should update tenant member successfully', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantMemberUpdateRequestDto = {
        id: tenantMemberId,
        role: TenantMemberRoleEnum.ADMIN,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Tenant member updated successfully',
        id: tenantMemberId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.tenantMemberUpdate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantMemberUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(TenantMemberUpdateCommand);
      expect(command.id.value).toBe(tenantMemberId);
      expect(command.role?.value).toBe(TenantMemberRoleEnum.ADMIN);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Tenant member updated successfully',
        id: tenantMemberId,
      });
    });

    it('should handle errors from command bus', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantMemberUpdateRequestDto = {
        id: tenantMemberId,
        role: TenantMemberRoleEnum.ADMIN,
      };

      const error = new Error('Tenant member not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantMemberUpdate(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantMemberUpdateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });

    it('should update tenant member with different roles', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const roles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
        TenantMemberRoleEnum.MEMBER,
        TenantMemberRoleEnum.GUEST,
      ];

      for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        const input: TenantMemberUpdateRequestDto = {
          id: tenantMemberId,
          role,
        };

        const mutationResponse: MutationResponseDto = {
          success: true,
          message: 'Tenant member updated successfully',
          id: tenantMemberId,
        };

        mockCommandBus.execute.mockResolvedValue(undefined);
        mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
          mutationResponse,
        );

        await resolver.tenantMemberUpdate(input);

        const command = (mockCommandBus.execute as jest.Mock).mock.calls[i][0];
        expect(command.role?.value).toBe(role);
      }
    });
  });

  describe('tenantMemberRemove', () => {
    it('should remove tenant member successfully', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantMemberRemoveRequestDto = {
        id: tenantMemberId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Tenant member removed successfully',
        id: tenantMemberId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.tenantMemberRemove(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantMemberRemoveCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(TenantMemberRemoveCommand);
      expect(command.id.value).toBe(tenantMemberId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Tenant member removed successfully',
        id: tenantMemberId,
      });
    });

    it('should handle errors from command bus', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantMemberRemoveRequestDto = {
        id: tenantMemberId,
      };

      const error = new Error('Tenant member not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantMemberRemove(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantMemberRemoveCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
