import { TenantCreateCommand } from '@/tenant-context/tenants/application/commands/tenant-create/tenant-create.command';
import { TenantDeleteCommand } from '@/tenant-context/tenants/application/commands/tenant-delete/tenant-delete.command';
import { TenantUpdateCommand } from '@/tenant-context/tenants/application/commands/tenant-update/tenant-update.command';
import { TenantCreateRequestDto } from '@/tenant-context/tenants/transport/graphql/dtos/requests/tenant-create.request.dto';
import { TenantDeleteRequestDto } from '@/tenant-context/tenants/transport/graphql/dtos/requests/tenant-delete.request.dto';
import { TenantUpdateRequestDto } from '@/tenant-context/tenants/transport/graphql/dtos/requests/tenant-update.request.dto';
import { TenantMutationsResolver } from '@/tenant-context/tenants/transport/graphql/resolvers/tenant-mutations.resolver';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { CommandBus } from '@nestjs/cqrs';

describe('TenantMutationsResolver', () => {
  let resolver: TenantMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new TenantMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('tenantCreate', () => {
    it('should create tenant successfully', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantCreateRequestDto = {
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

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Tenant created successfully',
        id: tenantId,
      };

      mockCommandBus.execute.mockResolvedValue(tenantId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.tenantCreate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(TenantCreateCommand);
      expect(command.name.value).toBe(input.name);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Tenant created successfully',
        id: tenantId,
      });
    });

    it('should handle errors when creating tenant', async () => {
      const input: TenantCreateRequestDto = {
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

      const error = new Error('Tenant creation failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantCreate(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantCreateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('tenantUpdate', () => {
    it('should update tenant successfully', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantUpdateRequestDto = {
        id: tenantId,
        name: 'Updated Tenant',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Tenant updated successfully',
        id: tenantId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.tenantUpdate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(TenantUpdateCommand);
      expect(command.id.value).toBe(tenantId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Tenant updated successfully',
        id: tenantId,
      });
    });

    it('should handle errors when updating tenant', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantUpdateRequestDto = {
        id: tenantId,
        name: 'Updated Tenant',
      };

      const error = new Error('Tenant update failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantUpdate(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantUpdateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('tenantDelete', () => {
    it('should delete tenant successfully', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantDeleteRequestDto = {
        id: tenantId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Tenant deleted successfully',
        id: tenantId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.tenantDelete(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(TenantDeleteCommand);
      expect(command.id.value).toBe(tenantId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Tenant deleted successfully',
        id: tenantId,
      });
    });

    it('should handle errors when deleting tenant', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: TenantDeleteRequestDto = {
        id: tenantId,
      };

      const error = new Error('Tenant deletion failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantDelete(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(TenantDeleteCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
